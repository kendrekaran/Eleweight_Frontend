import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, User, Weight, Ruler, Calendar, Target, ArrowRight, ChevronRight, Copy } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import NavBar from '../Components/NavBar';
import { Navigate } from 'react-router-dom';


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const FitnessApp = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietPreference: 'non-vegetarian'
  });
  

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ calories: 0, protein: 0 });
  const [animatedDietPlan, setAnimatedDietPlan] = useState('');
  const [copied, setCopied] = useState(false);
  const token = localStorage.getItem('token');
  
    useEffect(() => {
      if (!token) {
        navigate("/login");
      }
    }, [token, Navigate]);
  

  const glassPanel = "backdrop-blur-lg bg-white/30 border border-white/40 shadow-lg";
  const gradientText = "bg-gradient-to-r from-purple-500 via-purple-500 to-sky-500 bg-clip-text text-transparent";
  const neumorphicInput = "bg-gray-50 border-2 border-transparent rounded-xl shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1),-4px_-4px_10px_0px_rgba(255,255,255,0.9)] focus:shadow-[inset_4px_4px_10px_0px_rgba(0,0,0,0.1),inset_-4px_-4px_10px_0px_rgba(255,255,255,0.9)] transition-all duration-300";

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (Little/No Exercise)', multiplier: 1.2 },
    { value: 'light', label: 'Light (1-3 days/week)', multiplier: 1.375 },
    { value: 'moderate', label: 'Moderate (3-5 days/week)', multiplier: 1.55 },
    { value: 'active', label: 'Active (6-7 days/week)', multiplier: 1.725 },
    { value: 'veryActive', label: 'Very Active (Athletic/Physical Job)', multiplier: 1.9 }
  ];

  const goals = [
    { value: 'lose', label: 'Lose Weight', multiplier: 0.8 },
    { value: 'maintain', label: 'Maintain Weight', multiplier: 1 },
    { value: 'gain', label: 'Gain Weight', multiplier: 1.15 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMR = () => {
    const { weight, height, age, gender } = formData;
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (gender === 'male') {
      return 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      return 10 * w + 6.25 * h - 5 * a - 161;
    }
  };

  const calculateTDEE = (bmr) => {
    const activity = activityLevels.find(a => a.value === formData.activityLevel);
    return bmr * (activity?.multiplier || 1.55);
  };

  const calculateMacros = (calories) => {
    const goal = goals.find(g => g.value === formData.goal);
    const adjustedCalories = calories * (goal?.multiplier || 1);

    return {
      calories: Math.round(adjustedCalories),
      protein: Math.round(parseFloat(formData.weight) * 2.2),
      carbs: Math.round((adjustedCalories * 0.45) / 4),
      fats: Math.round((adjustedCalories * 0.25) / 9)
    };
  };

  const getDietPlan = async (calories, protein) => {
    const prompt = `Generate a concise yet effective ${formData.dietPreference} diet plan based on the following daily requirements:

    Calories: ${calories} kcal
    Protein: ${protein}g
    Goal: ${formData.goal} weight
    Activity Level: ${formData.activityLevel}
    Diet Preference: ${formData.dietPreference}

    The plan should include:
    1️⃣ Meal timings (breakfast, lunch, dinner, snacks)
    2️⃣ Recommended foods (categorized: proteins, carbs, fats)
    3️⃣ Foods to avoid
    4️⃣ Quick meal suggestions

    Format the response in bullet points. Keep it practical and easy to follow.
    Don't use * symbol for bullets.
    Ensure all meal suggestions comply with ${formData.dietPreference} dietary restrictions.
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text || text.toLowerCase().includes('undefined')) {
        throw new Error('Invalid response from AI');
      }
      return text;
    } catch (error) {
      console.error('Error generating diet plan:', error);
      throw new Error('Failed to generate diet plan');
    }
  };

  useEffect(() => {
    if (results?.dietPlan) {
      setAnimatedDietPlan(''); 
      let i = 0;
      const text = String(results.dietPlan); 
      
      const interval = setInterval(() => {
        if (i < text.length) {
          setAnimatedDietPlan(prev => prev + text[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [results?.dietPlan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnimatedDietPlan('');
    setResults(null);

    try {
      const bmr = calculateBMR();
      const tdee = calculateTDEE(bmr);
      const macros = calculateMacros(tdee);
      
      const dietPlanText = await getDietPlan(macros.calories, macros.protein);
      
      if (!dietPlanText) {
        throw new Error('No diet plan was generated');
      }

      setResults({
        ...macros,
        dietPlan: String(dietPlanText || "").trim()
      });
      
      setProgress({ 
        calories: 65,
        protein: 80 
      });
    } catch (err) {
      setError('An error occurred while calculating your plan. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyDietPlan = async () => {
    try {
      await navigator.clipboard.writeText(results.dietPlan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-sky-50">
      <NavBar/>
      <div className='p-4 md:p-8'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className={`mb-2 text-3xl font-bold md:text-4xl ${gradientText}`}>
            Personalized AI Diet Planner
          </h1>
          <p className="text-gray-600">Get a customized nutrition plan tailored to your needs</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="p-8 mx-auto max-w-4xl rounded-xl border shadow-xl backdrop-blur-sm bg-white/90 border-white/50">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex gap-2 items-center mb-3 text-gray-700">
                <Weight className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Weight (kg)</span>
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={`px-4 w-full h-14 ${neumorphicInput}`}
                placeholder="Enter weight"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex gap-2 items-center mb-3 text-gray-700">
                <Ruler className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Height (cm)</span>
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className={`px-4 w-full h-14 ${neumorphicInput}`}
                placeholder="Enter height"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex gap-2 items-center mb-3 text-gray-700">
                <Calendar className="w-5 h-5 text-sky-500" />
                <span className="font-medium">Age</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`px-4 w-full h-14 ${neumorphicInput}`}
                placeholder="Enter age"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex gap-2 items-center mb-3 text-gray-700">
                <User className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Gender</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`px-4 w-full h-14 ${neumorphicInput}`}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex gap-2 items-center mb-3 text-gray-700">
                <Activity className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Activity Level</span>
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className={`px-4 w-full h-14 ${neumorphicInput}`}
                required
              >
                {activityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex gap-2 items-center mb-3 text-gray-700">
                <Target className="w-5 h-5 text-sky-500" />
                <span className="font-medium">Goal</span>
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className={`px-4 w-full h-14 ${neumorphicInput}`}
                required
              >
                {goals.map(goal => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex gap-2 items-center mb-3 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <span className="font-medium">Diet Preference</span>
              </label>
              <select
                name="dietPreference"
                value={formData.dietPreference}
                onChange={handleInputChange}
                className={`px-4 w-full h-14 ${neumorphicInput}`}
                required
              >
                <option value="non-vegetarian">Non Vegetarian</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </motion.div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <div className="relative px-4 py-3 text-red-700 bg-red-100 rounded border border-red-400" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex gap-2 items-center px-6 py-3 mx-auto font-medium text-white bg-purple-500 rounded-lg transition-all duration-300 hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  Calculate Plan
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mx-auto mt-8 space-y-6 max-w-4xl"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="p-6 text-white bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                  <h3 className="font-medium text-purple-100">Daily Calories</h3>
                  <p className="text-2xl font-bold">{results.calories.toLocaleString()} kcal</p>
                </div>
                <div className="p-6 text-white bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                  <h3 className="font-medium text-green-100">Protein</h3>
                  <p className="text-2xl font-bold">{results.protein}g</p>
                </div>
                <div className="p-6 text-white bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg">
                  <h3 className="font-medium text-yellow-100">Carbs</h3>
                  <p className="text-2xl font-bold">{results.carbs}g</p>
                </div>
                <div className="p-6 text-white bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                  <h3 className="font-medium text-purple-100">Fats</h3>
                  <p className="text-2xl font-bold">{results.fats}g</p>
                </div>
              </div>

              <div className="p-6 rounded-lg shadow-md backdrop-blur-sm bg-white/80">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Your AI-Generated Diet Plan</h3>
                  <motion.button
                    onClick={copyDietPlan}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex gap-2 items-center px-4 py-2 text-white bg-purple-500 rounded-lg transition-colors hover:bg-purple-600"
                  >
                    <Copy className="w-4 h-4" />
                    <div className='hidden sm:block'>{copied ? 'Copied!' : 'Copy Plan'}</div>
                  </motion.button>
                </div>
                <div className="prose prose-purple max-w-none overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-100 pr-4">
                  <div className="space-y-4">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <div className="p-4 rounded-lg shadow-sm bg-white/50">
                            <p className="text-gray-600">{children}</p>
                          </div>
                        ),
                        ul: ({ children }) => (
                          <div className="p-4 rounded-lg shadow-sm bg-white/50">
                            <ul className="space-y-2">{children}</ul>
                          </div>
                        ),
                        li: ({ children }) => (
                          <li className="flex gap-2 items-start text-gray-700">
                            <ChevronRight className="flex-shrink-0 mt-1 w-4 h-4 text-purple-500" />
                            <span className="flex-1 break-words">{children}</span>
                          </li>
                        ),
                      }}
                    >
                      {animatedDietPlan}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FitnessApp;