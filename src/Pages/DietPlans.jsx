import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, User, Weight, Ruler, Calendar, Target, Pocket, ArrowRight, ChevronRight, Copy } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import NavBar from '../Components/NavBar';
import { Navigate } from 'react-router-dom';


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const FitnessApp = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain'
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
  const gradientText = "bg-gradient-to-r from-blue-500 via-blue-500 to-sky-500 bg-clip-text text-transparent";
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
    const prompt = `Generate a concise yet effective diet plan based on the following daily requirements:

    Calories: ${calories} kcal
    Protein: ${protein}g
    Goal: ${formData.goal} weight
    Activity Level: ${formData.activityLevel}

    The plan should include:
    1️⃣ Meal timings (breakfast, lunch, dinner, snacks)
    2️⃣ Recommended foods (categorized: proteins, carbs, fats)
    3️⃣ Foods to avoid
    4️⃣ Quick meal suggestions

    Format the response in bullet points. Keep it practical and easy to follow.
    Don't use * symbol for bullets.
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-sky-50">
      <NavBar/>
      <div className='p-4 md:p-8'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${gradientText}`}>
            AI Fitness Journey
          </h1>
          <p className="text-gray-600">Transform your lifestyle with AI-powered nutrition</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex items-center gap-2 text-gray-700 mb-3">
                <Weight className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Weight (kg)</span>
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={`w-full h-14 px-4 ${neumorphicInput}`}
                placeholder="Enter weight"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex items-center gap-2 text-gray-700 mb-3">
                <Ruler className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Height (cm)</span>
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className={`w-full h-14 px-4 ${neumorphicInput}`}
                placeholder="Enter height"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex items-center gap-2 text-gray-700 mb-3">
                <Calendar className="w-5 h-5 text-sky-500" />
                <span className="font-medium">Age</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full h-14 px-4 ${neumorphicInput}`}
                placeholder="Enter age"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex items-center gap-2 text-gray-700 mb-3">
                <User className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Gender</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full h-14 px-4 ${neumorphicInput}`}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="group">
              <label className="flex items-center gap-2 text-gray-700 mb-3">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Activity Level</span>
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className={`w-full h-14 px-4 ${neumorphicInput}`}
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
              <label className="flex items-center gap-2 text-gray-700 mb-3">
                <Target className="w-5 h-5 text-sky-500" />
                <span className="font-medium">Goal</span>
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className={`w-full h-14 px-4 ${neumorphicInput}`}
                required
              >
                {goals.map(goal => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
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
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
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
              className="px-6 py-3 rounded-lg text-white font-medium bg-blue-500 hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
              className="mt-8 max-w-4xl mx-auto space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <h3 className="font-medium text-gray-800">Daily Calories</h3>
                  <p className="text-2xl font-bold text-blue-500">{results.calories.toLocaleString()} kcal</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <h3 className="font-medium text-gray-800">Protein</h3>
                  <p className="text-2xl font-bold text-blue-500">{results.protein}g</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <h3 className="font-medium text-gray-800">Carbs</h3>
                  <p className="text-2xl font-bold text-blue-500">{results.carbs}g</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Your AI-Generated Diet Plan</h3>
                  <motion.button
                    onClick={copyDietPlan}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center  gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <div className='hiddden sm:inline-flex'>{copied ? 'Copied!' : 'Copy Plan'}</div>
                  </motion.button>
                </div>
                <div className="prose prose-blue max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-4 text-gray-600">{children}</p>,
                      ul: ({ children }) => <ul className="space-y-2 mb-4">{children}</ul>,
                      li: ({ children }) => (
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                          <span>{children}</span>
                        </li>
                      ),
                    }}
                  >
                    {animatedDietPlan}
                  </ReactMarkdown>
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