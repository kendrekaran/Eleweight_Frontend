import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, User, Weight, Ruler, Calendar, Target, ArrowRight, ChevronRight, Copy } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import NavBar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const FitnessApp = () => {
  const navigate = useNavigate();
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
  const [copied, setCopied] = useState(false);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  
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
    const prompt = `Generate a detailed ${formData.dietPreference} diet plan based on:
    
    Calories: ${calories} kcal/day
    Protein: ${protein}g/day
    Goal: ${formData.goal} weight
    Activity Level: ${formData.activityLevel}
    Diet Preference: ${formData.dietPreference}

    Format the response with these sections using markdown:
    
    # Daily Meal Schedule
    - List meal timings and portion suggestions
    
    # Food Recommendations
    ## Proteins
    - List protein sources
    ## Carbohydrates
    - List carb sources
    ## Healthy Fats
    - List fat sources
    
    # Foods to Avoid
    - List foods to avoid
    
    # Quick Meal Ideas
    ## Breakfast Options
    - List 2-3 quick breakfast ideas
    ## Lunch Options
    - List 2-3 quick lunch ideas
    ## Dinner Options
    - List 2-3 quick dinner ideas
    ## Healthy Snacks
    - List 2-3 snack ideas

    Keep suggestions practical and easy to follow.
    Use - for bullet points.
    Ensure all suggestions comply with ${formData.dietPreference} preferences.`;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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
    <div className="min-h-screen">
      <NavBar/>
      <div className="p-4 mx-auto max-w-6xl md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className={`mb-2 text-3xl font-bold md:text-4xl ${gradientText}`}>
            Personalized AI Diet Planner
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600">Get a customized nutrition plan tailored to your goals, preferences, and lifestyle</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 mx-auto rounded-xl border shadow-xl backdrop-blur-sm bg-white/90 border-white/50"
        >
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Enter Your Details</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2 group">
                <label className="flex gap-2 items-center text-gray-700">
                  <Weight className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Weight (kg)</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={`px-4 w-full h-12 ${neumorphicInput}`}
                  placeholder="Enter weight"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2 group">
                <label className="flex gap-2 items-center text-gray-700">
                  <Ruler className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Height (cm)</span>
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className={`px-4 w-full h-12 ${neumorphicInput}`}
                  placeholder="Enter height"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2 group">
                <label className="flex gap-2 items-center text-gray-700">
                  <Calendar className="w-5 h-5 text-sky-500" />
                  <span className="font-medium">Age</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`px-4 w-full h-12 ${neumorphicInput}`}
                  placeholder="Enter age"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2 group">
                <label className="flex gap-2 items-center text-gray-700">
                  <User className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Gender</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`px-4 w-full h-12 ${neumorphicInput}`}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2 group">
                <label className="flex gap-2 items-center text-gray-700">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Activity Level</span>
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  className={`px-4 w-full h-12 ${neumorphicInput}`}
                  required
                >
                  {activityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2 group">
                <label className="flex gap-2 items-center text-gray-700">
                  <Target className="w-5 h-5 text-sky-500" />
                  <span className="font-medium">Goal</span>
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className={`px-4 w-full h-12 ${neumorphicInput}`}
                  required
                >
                  {goals.map(goal => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2 group">
                <label className="flex gap-2 items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                  <span className="font-medium">Diet Preference</span>
                </label>
                <select
                  name="dietPreference"
                  value={formData.dietPreference}
                  onChange={handleInputChange}
                  className={`px-4 w-full h-12 ${neumorphicInput}`}
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
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6"
                >
                  <div className="relative px-4 py-3 text-red-700 bg-red-100 rounded-lg border border-red-400" role="alert">
                    <span className="block sm:inline">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex gap-2 items-center px-8 py-3 mx-auto font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
                    <span>Generating Plan...</span>
                  </>
                ) : (
                  <>
                    <span>Calculate Your Plan</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-8 space-y-6"
            >
              {/* Metrics cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 text-white bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg"
                >
                  <h3 className="font-medium text-purple-100">Daily Calories</h3>
                  <p className="text-2xl font-bold">{results.calories.toLocaleString()} kcal</p>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg"
                >
                  <h3 className="font-medium text-blue-100">Protein</h3>
                  <p className="text-2xl font-bold">{results.protein}g</p>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 text-white bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg"
                >
                  <h3 className="font-medium text-amber-100">Carbs</h3>
                  <p className="text-2xl font-bold">{results.carbs}g</p>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 text-white bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg"
                >
                  <h3 className="font-medium text-green-100">Fats</h3>
                  <p className="text-2xl font-bold">{results.fats}g</p>
                </motion.div>
              </div>

              {/* Diet plan */}
              <motion.div 
                className="p-6 rounded-xl shadow-lg backdrop-blur-sm bg-white/90"
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 sm:text-2xl">Your Personalized Diet Plan</h3>
                  <motion.button
                    onClick={copyDietPlan}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex gap-2 items-center px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg shadow-md transition-colors hover:shadow-lg"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:block">{copied ? 'Copied!' : 'Copy Plan'}</span>
                  </motion.button>
                </div>
                
                <div className="prose prose-purple max-w-none overflow-y-auto max-h-[500px] pr-4 bg-white/50 rounded-lg p-6 shadow-inner">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h2 className="pb-2 mt-8 mb-4 text-2xl font-bold text-purple-700 border-b-2 border-purple-200">{children}</h2>
                      ),
                      h2: ({ children }) => (
                        <h3 className="mt-6 mb-3 text-xl font-semibold text-purple-600">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="grid gap-3 my-4 md:grid-cols-2">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="flex gap-3 items-start p-4 text-gray-700 rounded-lg shadow-sm transition-colors duration-200 bg-white/70 hover:bg-white/90">
                          <ChevronRight className="flex-shrink-0 mt-1 w-5 h-5 text-purple-500" />
                          <span className="flex-1">{children}</span>
                        </li>
                      ),
                    }}
                  >
                    {results.dietPlan}
                  </ReactMarkdown>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FitnessApp;