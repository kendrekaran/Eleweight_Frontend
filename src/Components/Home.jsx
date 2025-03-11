import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import FeatureCards from './FeaturedCards';
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, List, Utensils, MoveRight, BookOpen, Plus, Calendar, MapPin, ArrowRight, Star, ChevronDown, Users, TrendingUp, Brain, ChevronLeft, ChevronRight, Check, Crown, Zap, Lock, Shield } from "lucide-react";
import FeatureShowcase from './FeatureShowcase';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('all');
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const featureSliderRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  // Hero showcase features with expanded options
  const heroFeatures = [
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      icon: Dumbbell,
      title: "Browse Exercises",
      description: "Explore our comprehensive library of exercises with detailed instructions, animations, and tips to perfect your form.",
      link: "/exercises",
      color: "from-blue-600 to-blue-400"
    },
    {
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1753&q=80",
      icon: Brain,
      title: "AI Diet Plans",
      description: "Get personalized nutrition recommendations powered by AI that adapt to your fitness goals, preferences, and dietary restrictions.",
      link: "/diet",
      color: "from-green-600 to-emerald-400",
      isNew: true
    },
    {
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      icon: MapPin,
      title: "Find Nearby Gyms",
      description: "Discover fitness centers in your area with real-time availability, ratings, and special offers to kickstart your fitness journey.",
      link: "/nearby-gyms",
      color: "from-purple-600 to-indigo-400",
      isNew: true
    },
    {
      image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      icon: Calendar,
      title: "My Workout Plans",
      description: "Access and manage your personalized workout routines, track your progress, and adjust your plans as you grow stronger.",
      link: "/my-plans",
      color: "from-orange-500 to-amber-400"
    },
    {
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGd5bXxlbnwwfHwwfHx8MA%3D%3D",
      icon: Plus,
      title: "Create Custom Plans",
      description: "Design your own personalized workout routines with our intuitive plan builder. Mix and match exercises for optimal results.",
      link: "/create-plan",
      color: "from-red-500 to-pink-400"
    }
  ];

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Auto-play functionality for the feature slider
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayTimerRef.current = setInterval(() => {
        if (!isHovering) {
          setActiveFeature(prev => (prev === heroFeatures.length - 1 ? 0 : prev + 1));
        }
      }, 3000); // Change slide every 3 seconds instead of 5 seconds
    };

    // Always auto-play, no conditional check
    startAutoPlay();

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isHovering, heroFeatures.length]); // Remove isAutoPlaying from dependencies

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const FeatureCard = ({ image, Icon, title, description, link, isNew }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden relative mx-auto w-full max-w-5xl bg-white rounded-3xl border shadow-sm transition-all duration-300 group hover:shadow-xl"
      >
        {isNew && (
          <div className="absolute top-4 right-4 z-10 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
            NEW
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="flex relative flex-col justify-center items-center p-4 md:ml-24 md:flex-row gap- sm:gap-24 sm:p-6 lg:p-8">

          <div className="w-full md:w-1/3 lg:w-72">
            <div className="overflow-hidden relative rounded-2xl aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br transition-transform duration-300 from-sky-100/20 to-gray-100/20 group-hover:scale-110" />
              <img
                src={image}
                className="object-cover object-center p-4 w-full h-full rounded-3xl transition-transform duration-300 group-hover:scale-105"
                alt={title}
              />
            </div>
          </div>
  
          {/* Content Container */}
          <div className="flex flex-col flex-1 gap-4 sm:gap-6">
            <div className="flex gap-4 items-center">
              <div className="flex justify-center items-center w-12 h-12 bg-sky-50 rounded-2xl transition-colors duration-300 sm:w-14 sm:h-14 group-hover:bg-sky-100">
                <Icon className="w-6 h-6 text-sky-600 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h3>
            </div>
  
            <p className="text-sm leading-relaxed text-gray-600 sm:text-base sm:pr-44">
              {description}
            </p>
  
            <Link
              to={link}
              className="inline-flex justify-between items-center px-4 py-3 w-full text-sm text-white bg-sky-600 rounded-xl transition-colors duration-200 sm:w-80 sm:px-6 sm:text-base hover:bg-sky-700 group/button"
            >
              <span>Get Started</span>
              <MoveRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover/button:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  const nextFeature = () => {
    // Don't stop auto-play when manually navigating
    setActiveFeature((prev) => (prev === heroFeatures.length - 1 ? 0 : prev + 1));
  };

  const prevFeature = () => {
    // Don't stop auto-play when manually navigating
    setActiveFeature((prev) => (prev === 0 ? heroFeatures.length - 1 : prev - 1));
  };

  const goToFeature = (index) => {
    // Don't stop auto-play when manually navigating
    setActiveFeature(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Section with FeatureShowcase */}
      <section className="overflow-hidden relative pt-20">
        {/* Decorative elements */}
        <div className="absolute right-20 top-40 w-64 h-64 bg-gradient-to-br rounded-full blur-3xl from-blue-200/20 to-blue-200/20" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br rounded-full blur-3xl from-sky-200/20 to-sky-200/20" />

        <div className="container relative z-10 px-6 mx-auto sm:px-16 lg:px-32">
          <div className="flex flex-col gap-4 justify-center items-center px-8 py-8 w-full lg:flex-row-reverse sm:gap-12">
            <motion.div
              className="relative w-full lg:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-400/20 rounded-[2rem] blur-3xl" />
              <img
                src="Toji.svg"
                alt="Fitness"
                className="object-contain relative pt-4 mx-auto w-60 max-w-xl drop-shadow-2xl md:w-full md:pt-0"
              />
            </motion.div>

            <motion.div
              className="space-y-8 w-full lg:w-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="space-y-2 sm:space-y-8">
                <motion.div
                  className="hidden gap-2 items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm sm:inline-flex bg-white/80"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Dumbbell className="sm:w-4 sm:h-4" />
                  <span className='text-xs'>Your Fitness Journey Starts Here</span>
                </motion.div>

                <h1 className="text-3xl font-bold leading-tight text-center sm:text-5xl md:text-7xl sm:text-start">
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-800">
                    Your 
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-sky-600">
                    {" "}
                    Personal
                  </span>
                    <br />
                    Guide To
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-sky-600">
                    {" "}
                    Fitness
                  </span>
                </h1>

                <p className="max-w-xl text-xs leading-tight text-center text-gray-600 sm:text-start sm:text-base">
                  Explore customized exercises for your fitness level. Track progress, stay motivated, and build a stronger, healthier you.
                </p>
              </div>

              <div className="flex flex-col gap-4 px-8 sm:flex-row sm:px-0">
                <Link
                  to="/exercises"
                  className="group inline-flex items-center justify-center gap-2 px-2 py-2 sm:px-6 sm:py-3 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-2xl font-semibold hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 from-blue-400/20 group-hover:opacity-100" />
                  Browse Exercises
                  <MoveRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/create-plan"
                  className="group inline-flex items-center justify-center gap-2 px-2 py-2 sm:px-6 sm:py-3 bg-white border border-gray-200 text-gray-900 rounded-2xl font-semibold hover:border-gray-300 hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
                >
                  Create Workout
                  <Plus className="transition-transform duration-300 group-hover:rotate-12" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Feature Showcase */}
        <div className="overflow-hidden mt-12 mb-12 sm:mt-24">
          <div className="container px-6 mx-auto sm:px-16 lg:px-32">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Discover Our Key Features</h2>
              <p className="mt-2 text-gray-600">Everything you need for your fitness journey in one place</p>
            </div>
            
            <div 
              className="relative" 
              ref={featureSliderRef}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Feature Cards Slider */}
              <div className="overflow-hidden relative rounded-2xl shadow-xl">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* Background Image with Overlay */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={`bg-${activeFeature}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
                      <img 
                        src={heroFeatures[activeFeature].image} 
                        alt={heroFeatures[activeFeature].title}
                        className="object-cover w-full h-full"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Content */}
                  <div className="flex absolute inset-0 z-20 justify-center items-center">
                    <div className="px-6 py-12 w-full max-w-4xl text-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`content-${activeFeature}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="flex flex-col items-center"
                        >
                          <div className={`p-4 rounded-full bg-gradient-to-br ${heroFeatures[activeFeature].color} shadow-lg mb-6`}>
                            {React.createElement(heroFeatures[activeFeature].icon, {
                              className: "w-8 h-8 text-white"
                            })}
                          </div>
                          
                          <div className="flex gap-3 items-center mb-4">
                            <h3 className="text-3xl font-bold text-white sm:text-4xl">{heroFeatures[activeFeature].title}</h3>
                            {heroFeatures[activeFeature].isNew && (
                              <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                                NEW
                              </span>
                            )}
                          </div>
                          
                          <p className="mb-8 max-w-2xl text-lg text-white/90">
                            {heroFeatures[activeFeature].description}
                          </p>
                          
                          <Link
                            to={heroFeatures[activeFeature].link}
                            className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${heroFeatures[activeFeature].color} text-white rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg`}
                          >
                            Explore {heroFeatures[activeFeature].title}
                            <MoveRight className="ml-1 w-5 h-5" />
                          </Link>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex absolute inset-y-0 right-4 left-4 justify-between items-center pointer-events-none">
                <button 
                  onClick={prevFeature}
                  className="flex justify-center items-center w-10 h-10 rounded-full border shadow-lg backdrop-blur-md transition-colors pointer-events-auto sm:w-12 sm:h-12 bg-black/20 text-white/90 border-white/10 hover:bg-black/30"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                <button 
                  onClick={nextFeature}
                  className="flex justify-center items-center w-10 h-10 rounded-full border shadow-lg backdrop-blur-md transition-colors pointer-events-auto sm:w-12 sm:h-12 bg-black/20 text-white/90 border-white/10 hover:bg-black/30"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              {/* Progress bar - always visible */}
              <div className="absolute right-0 bottom-0 left-0 z-20 h-1 bg-white/10">
                <motion.div
                  className={`h-full bg-gradient-to-r ${heroFeatures[activeFeature].color}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 3,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  key={`progress-${activeFeature}`}
                />
              </div>
            </div>
            
            {/* Dots Navigation */}
            <div className="flex gap-2 justify-center mt-6">
              {heroFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToFeature(index)}
                  className={`h-2 rounded-full transition-all ${
                    activeFeature === index 
                      ? 'w-8 bg-blue-600' 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section with improved styling */}
      <section className="px-6 py-24 bg-gradient-to-b from-sky-100 to-white sm:px-16 lg:px-32">
        <motion.div 
          className="mb-16 text-center"
          {...fadeInUp}
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            Real Results
          </span>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 sm:text-5xl">
            Train Hard. Track Results.
            <br />
            Transform Your Fitness Journey.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-gray-600">
            Join thousands of users who have already transformed their bodies and lives with our personalized workout plans and nutrition guidance.
          </p>
        </motion.div>
        <FeatureCards />
      </section>

      {/* Premium Section */}
      <section className="overflow-hidden relative px-6 py-24 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 sm:px-16 lg:px-32">
        {/* Decorative elements */}
        <div className="overflow-hidden absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute right-0 top-1/2 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center items-center mb-6">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="inline-block px-4 py-2 mb-4 text-sm font-medium text-yellow-300 rounded-full border bg-yellow-900/30 border-yellow-500/20">
                Upgrade to Premium
              </span>
              <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                Unlock Your Full Fitness Potential
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
                Take your fitness journey to the next level with Eleweight Premium. Get exclusive access to premium features and content.
              </p>
            </motion.div>
          </div>

          {/* Premium Features */}
          <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Dumbbell,
                title: "100+ Premium Exercises",
                description: "Access our complete library of exercises with detailed instructions, HD videos, and expert tips.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Brain,
                title: "AI Workout Recommendations",
                description: "Get personalized workout recommendations based on your goals, progress, and preferences.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: Utensils,
                title: "Custom Meal Plans",
                description: "Receive tailored nutrition plans designed to complement your workout routine and dietary needs.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Shield,
                title: "Advanced Progress Tracking",
                description: "Track your fitness journey with detailed analytics, body measurements, and performance metrics.",
                color: "from-orange-500 to-orange-600"
              },
              {
                icon: Users,
                title: "Community Challenges",
                description: "Join exclusive challenges and compete with other premium members to stay motivated.",
                color: "from-pink-500 to-pink-600"
              },
              {
                icon: Zap,
                title: "Priority Support",
                description: "Get priority access to our support team and exclusive fitness content updates.",
                color: "from-amber-500 to-amber-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl border backdrop-blur-sm transition-colors bg-white/10 border-white/10 hover:bg-white/15"
              >
                <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg mb-4 inline-block`}>
                  {React.createElement(feature.icon, {
                    className: "w-6 h-6 text-white"
                  })}
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Pricing Cards */}
          <div className="flex flex-col gap-8 justify-center lg:flex-row">
            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 w-full max-w-md rounded-2xl border backdrop-blur-sm transition-colors bg-white/10 border-white/10 hover:bg-white/15"
            >
              <h3 className="mb-2 text-xl font-bold text-white">Monthly Premium</h3>
              <div className="flex gap-1 items-end mb-6">
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="mb-1 text-gray-300">/month</span>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  "Access to 100+ premium exercises",
                  "AI workout recommendations",
                  "Custom meal plans",
                  "Advanced progress tracking",
                  "Community challenges",
                  "Cancel anytime"
                ].map((feature, index) => (
                  <li key={index} className="flex gap-2 items-center text-gray-300">
                    <Check className="flex-shrink-0 w-5 h-5 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-3 w-full font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl transition-all hover:shadow-lg hover:from-blue-600 hover:to-indigo-700">
                Start Monthly Plan
              </button>
            </motion.div>

            {/* Annual Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="overflow-hidden relative p-8 w-full max-w-md bg-gradient-to-br rounded-2xl border backdrop-blur-sm transition-colors from-indigo-600/40 to-purple-600/40 border-indigo-500/20 hover:from-indigo-600/50 hover:to-purple-600/50"
            >
              <div className="absolute top-0 right-0 px-4 py-1 text-xs font-bold text-white bg-gradient-to-br from-yellow-400 to-amber-600 rounded-bl-lg">
                BEST VALUE
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Annual Premium</h3>
              <div className="flex gap-1 items-end mb-2">
                <span className="text-4xl font-bold text-white">$89.99</span>
                <span className="mb-1 text-gray-300">/year</span>
              </div>
              <p className="mb-6 text-sm text-green-400">Save $29.89 (25% off)</p>
              <ul className="mb-8 space-y-3">
                {[
                  "All monthly plan features",
                  "Priority support",
                  "Exclusive premium content",
                  "Early access to new features",
                  "Personalized fitness consultation",
                  "No price increases guaranteed"
                ].map((feature, index) => (
                  <li key={index} className="flex gap-2 items-center text-gray-300">
                    <Check className="flex-shrink-0 w-5 h-5 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-3 w-full font-medium text-white bg-gradient-to-r from-yellow-400 to-amber-600 rounded-xl transition-all hover:shadow-lg hover:from-yellow-500 hover:to-amber-700">
                Start Annual Plan
              </button>
            </motion.div>
          </div>

          {/* Money-back guarantee */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              30-day money-back guarantee. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section with tabs */}
      <section className="px-6 py-24 bg-white sm:px-16 lg:px-32">
        {/* ... existing code ... */}
      </section>

      {/* Call to Action Section */}
      <section className="px-6 py-24 bg-gradient-to-r from-blue-600 to-indigo-700 sm:px-16 lg:px-32">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                Ready to Transform Your Fitness Journey?
              </h2>
              <p className="mb-10 text-lg text-blue-100">
                Join thousands of users who have already achieved their fitness goals with Eleweight. Start your journey today!
              </p>
              <div className="flex flex-col gap-4 justify-center sm:flex-row">
                <Link
                  to="/exercises"
                  className="px-8 py-4 font-semibold text-blue-700 bg-white rounded-xl shadow-lg transition-colors hover:bg-blue-50 hover:shadow-xl"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/plans"
                  className="px-8 py-4 font-semibold text-white bg-transparent rounded-xl border border-white transition-colors hover:bg-white/10"
                >
                  Explore Plans
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer with improved styling */}
      <footer className="px-6 py-16 text-white bg-gray-900 sm:px-16 lg:px-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="flex gap-4 items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg shadow-md">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Eleweight</h1>
              </div>
              <p className="mb-4 text-gray-400">Your personal guide to fitness excellence</p>
              <p className="text-gray-400">Created by Karan Kendre</p>
            </div>
            
            <div>
              <h2 className="mb-4 text-lg font-bold">Quick Links</h2>
              <ul className="space-y-2">
                {['Home', 'Exercises', 'Workout Plans', 'Diet Plans', 'Find Gyms'].map((link) => (
                  <li key={link}>
                    <a href="#" className="flex gap-2 items-center text-gray-400 transition-colors duration-200 hover:text-white">
                      <ArrowRight className="w-3 h-3" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-bold">Connect</h2>
              <ul className="space-y-2">
                {['Instagram', 'LinkedIn', 'Twitter', 'Facebook', 'YouTube'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 transition-colors duration-200 hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-bold">Legal</h2>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 transition-colors duration-200 hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-12 text-center text-gray-400 border-t border-gray-800">
            © 2024 Eleweight. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;