import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import FeatureCards from './FeaturedCards';
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, List,  MoveRight, BookOpen, Plus, Calendar, MapPin, ArrowRight,  Brain, ChevronLeft, ChevronRight, Check, Crown } from "lucide-react";

import PaymentModal from './PaymentModal';
import FitnessAdComponent from './FitnessAdComponent';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const featureSliderRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  
  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    name: '',
    price: '',
    period: ''
  });

  // Hero showcase features with expanded options
  const heroFeatures = [
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      icon: Dumbbell,
      title: "Browse Exercises",
      description: "Explore our comprehensive library of exercises with detailed instructions, animations, and tips to perfect your form.",
      link: "/exercises",
      color: "from-purple-600 to-indigo-400"
    },
    {
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      icon: List,
      title: "Browse by Muscle",
      description: "Target specific muscle groups with specialized exercises designed to maximize your gains and improve muscle definition.",
      link: "/muscle",
      color: "from-indigo-600 to-indigo-400"
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
    },
    {
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      icon: BookOpen,
      title: "Workout Plans",
      description: "Discover professionally designed workout plans for every fitness level, from beginners to advanced athletes.",
      link: "/plans",
      color: "from-purple-500 to-indigo-400"
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

  // Function to handle opening the payment modal
  const handleOpenPaymentModal = (planName, price, period) => {
    setSelectedPlan({
      name: planName,
      price: price,
      period: period
    });
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="overflow-x-hidden min-h-screen">
      <NavBar />

      {/* Hero Section with FeatureShowcase */}
      <section className="overflow-hidden relative bg-white">
        {/* Decorative elements */}
        <div className="absolute right-20 top-40 w-64 h-64 bg-gradient-to-br rounded-full blur-3xl from-purple-200/20 to-purple-200/20" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br rounded-full blur-3xl from-indigo-200/20 to-indigo-200/20" />

        <div className="container relative z-10 px-6 mx-auto sm:px-16 lg:px-32">
          <div className="flex flex-col gap-4 justify-center items-center px-8 py-8 w-full lg:flex-row-reverse sm:gap-12">
            <motion.div
              className="relative w-full lg:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-400/20 rounded-[2rem] blur-3xl" />
              <img
                src="Toji.svg"
                alt="Fitness"
                className="object-contain relative py-8 pt-4 mx-auto w-60 max-w-xl drop-shadow-2xl md:w-full md:pt-0"
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
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600">
                    {" "}
                    Personal
                  </span>
                    <br />
                    Guide To
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600">
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
                  className="group inline-flex items-center justify-center gap-2 px-2 py-2 sm:px-6 sm:py-3 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 from-purple-400/20 group-hover:opacity-100" />
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

        <section className="py-16 sm:py-20">
          <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
          <span className="inline-block px-5 py-2 mb-4 text-sm font-medium tracking-wide text-purple-700 bg-purple-100 rounded-full ring-1 ring-purple-200 shadow-sm">
          Find Your Perfect Fit
          </span>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600 sm:text-4xl">
          Start Your Fitness Journey Today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Discover personalized workout plans, targeted exercises, and convenient locations to achieve your fitness goals.
          </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Muscle Route Card - Optimized */}
          <div className="overflow-hidden relative rounded-xl shadow-md transition-all duration-300 hover:shadow-lg group">
          <div className="aspect-[4/5] overflow-hidden bg-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1613845205719-8c87760ab728?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDU5fHx8ZW58MHx8fHx8" 
              alt="Targeted muscle group training" 
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width="400"
              height="500"
            />
          </div>
          <div className="flex absolute inset-0 flex-col justify-end p-6 text-white bg-gradient-to-t to-transparent from-black/80">
            <div className="inline-flex items-center mb-2">
              <span className="flex justify-center items-center mr-3 w-8 h-8 bg-purple-600 rounded-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </span>
              <h3 className="text-xl font-bold">Muscle Groups</h3>
            </div>
            
            <div className="mt-auto">
              <Link to="/muscle" className="inline-flex items-center px-4 py-2 font-medium text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700">
                Explore Muscles
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className="flex justify-center items-center w-10 h-10 rounded-full shadow-md bg-white/90">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
            </span>
          </div>
          </div>

          {/* Workout Plans Card - Optimized */}
          <div className="overflow-hidden relative rounded-xl shadow-md transition-all duration-300 hover:shadow-lg group">
          <div className="aspect-[4/5] overflow-hidden bg-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1614367674345-f414b2be3e5b?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Professional workout plans" 
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width="400"
              height="500"
            />
          </div>
          <div className="flex absolute inset-0 flex-col justify-end p-6 text-white bg-gradient-to-t to-transparent from-black/80">
            <div className="inline-flex items-center mb-2">
              <span className="flex justify-center items-center mr-3 w-8 h-8 bg-indigo-600 rounded-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              <h3 className="text-xl font-bold">Custom Plans</h3>
            </div>
            <div className="mt-auto">
              <Link to="/plans" className="inline-flex items-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700">
                View Plans
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className="flex justify-center items-center w-10 h-10 rounded-full shadow-md bg-white/90">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </span>
          </div>
          </div>

          {/* Nearby Gyms Card - Optimized */}
          <div className="overflow-hidden relative rounded-xl shadow-md transition-all duration-300 hover:shadow-lg group">
          <div className="aspect-[4/5] overflow-hidden bg-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1597452485683-0e0bde820f87?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8" 
              alt="Local gym facilities" 
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width="400"
              height="500"
            />
          </div>
          <div className="flex absolute inset-0 flex-col justify-end p-6 text-white bg-gradient-to-t to-transparent from-black/80">
            <div className="inline-flex items-center mb-2">
              <span className="flex justify-center items-center mr-3 w-8 h-8 bg-blue-600 rounded-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="10" r="3"></circle>
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path>
                </svg>
              </span>
              <h3 className="text-xl font-bold">Nearby Gyms</h3>
            </div>
            <div className="mt-auto">
              <Link to="/nearby-gyms" className="inline-flex items-center px-4 py-2 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
                Find Gyms
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className="flex justify-center items-center w-10 h-10 rounded-full shadow-md bg-white/90">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </span>
          </div>
          </div>
          </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <div className="overflow-hidden mt-12 mb-12 sm:mt-24">
          <div className="container px-6 mx-auto sm:px-16 lg:px-0">
         
            
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
                    <div className="px-4 py-8 w-full max-w-4xl text-center sm:px-6 sm:py-12">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`content-${activeFeature}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="flex flex-col items-center"
                        >
                          <div className={`p-3 sm:p-4 rounded-full bg-gradient-to-br ${heroFeatures[activeFeature].color} shadow-lg mb-4 sm:mb-6`}>
                            {React.createElement(heroFeatures[activeFeature].icon, {
                              className: "w-6 h-6 sm:w-8 sm:h-8 text-white"
                            })}
                          </div>
                          
                          <div className="flex gap-2 items-center mb-2 sm:gap-3 sm:mb-4">
                            <h3 className="text-xl font-bold text-white sm:text-3xl md:text-4xl">{heroFeatures[activeFeature].title}</h3>
                          </div>
                          
                          <p className="hidden mb-8 max-w-2xl text-lg sm:block text-white/90">
                            {heroFeatures[activeFeature].description}
                          </p>
                          
                          <Link
                            to={heroFeatures[activeFeature].link}
                            className={`inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r ${heroFeatures[activeFeature].color} text-white rounded-xl text-sm sm:text-base font-medium transition-all hover:scale-105 hover:shadow-lg`}
                          >
                            Explore {heroFeatures[activeFeature].title}
                            <MoveRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
                          </Link>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex absolute inset-y-0 right-4 left-4 z-50 justify-between items-center pointer-events-none">
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
            </div>
            
            {/* Dots Navigation */}
            <div className="flex gap-2 justify-center mt-6">
              {heroFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToFeature(index)}
                  className={`h-2 rounded-full transition-all ${
                    activeFeature === index 
                      ? 'w-8 bg-purple-600' 
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
      <section className="py-24 sm:px-16 lg:px-32">
        <motion.div 
          className="mb-16 text-center"
          {...fadeInUp}
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full shadow-sm">
            Real Results
          </span>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-900 to-purple-700 sm:text-5xl">
            Train Hard. Track Results.
            <br />
            Transform Your Fitness Journey.
          </h2>
          <p className="px-2 mx-auto mt-2 max-w-2xl text-xs text-gray-600 sm:mt-6 sm:text-base">
            Join thousands of users who have already transformed their bodies and lives with our personalized workout plans and nutrition guidance.
          </p>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="relative">
          {/* Background decorative elements */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute right-0 top-1/2 w-80 h-80 bg-purple-200 rounded-full opacity-30 blur-3xl"></div>
          
          {/* Feature cards with container */}
          <div className="relative z-10">
            <FeatureCards />
          </div>
        </div>
      </section>

      <div>
        <FitnessAdComponent />
      </div>

     

      {/* Footer with improved styling */}
      <footer className="px-6 py-16 text-white bg-gray-900 sm:px-16 lg:px-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="flex gap-4 items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-lg shadow-md">
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

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan.name}
        price={selectedPlan.price}
        period={selectedPlan.period}
      />
    </div>
  );
};

export default Home;