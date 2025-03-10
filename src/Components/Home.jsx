import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import FeatureCards from './FeaturedCards';
import { motion } from "framer-motion";
import { Dumbbell, List, Utensils, MoveRight, BookOpen, Plus, Calendar, MapPin } from "lucide-react";
import FeaturesSection from './FeaturedCards';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

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
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br rounded-full blur-3xl from-blue-200/20 to-blue-200/20" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br rounded-full blur-3xl from-sky-200/20 to-sky-200/20" />

          <div className="relative z-10 container mx-auto sm:my-32 lg:my-0 px-6 sm:px-16 lg:px-32 h-full md:h-[90vh] flex items-center">
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
        </section>

        {/* New Features Banner */}
        <section className="py-12 text-white bg-gradient-to-r from-blue-600 to-blue-400">
          <div className="container px-6 mx-auto sm:px-16 lg:px-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4 text-center"
            >
              <h2 className="text-3xl font-bold sm:text-4xl">
                New Features Available!
              </h2>
              <p className="mx-auto max-w-2xl text-white/80">
                We've added exciting new features to help you take your fitness journey to the next level
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center mt-8">
                <Link
                  to="/exercises"
                  className="flex gap-2 items-center px-5 py-3 font-medium text-blue-600 bg-white rounded-lg transition-colors hover:bg-blue-50"
                >
                  <BookOpen className="w-5 h-5" />
                  Exercise Library
                </Link>
                <Link
                  to="/create-plan"
                  className="flex gap-2 items-center px-5 py-3 font-medium text-white bg-blue-700 rounded-lg transition-colors hover:bg-blue-800"
                >
                  <Plus className="w-5 h-5" />
                  Create Custom Plan
                </Link>
                <Link
                  to="/my-plans"
                  className="flex gap-2 items-center px-5 py-3 font-medium text-white rounded-lg border backdrop-blur-sm transition-colors bg-blue-500/20 border-white/20 hover:bg-blue-500/30"
                >
                  <Calendar className="w-5 h-5" />
                  My Workout Plans
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

      {/* Results Section */}
      <section className="px-6 py-24 bg-sky-200 sm:px-16 lg:px-32">
        <motion.div 
          className="mb-16 text-center"
          {...fadeInUp}
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 sm:text-5xl">
            Train Hard. Track Results.
            <br />
            Transform Your Fitness Journey.
          </h2>
        </motion.div>
        <FeatureCards />
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 text-white bg-gray-900 sm:px-16 lg:px-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="flex gap-4 items-center mb-4">
                <i className="text-white fi fi-ss-gym" />
                <h1 className="text-3xl font-bold">Eleweight</h1>
              </div>
              <p className="text-gray-400">Created by Karan Kendre</p>
            </div>
            
            {['Socials', 'Support', 'Company'].map((title) => (
              <div key={title}>
                <h2 className="mb-4 text-lg font-bold">{title}</h2>
                <ul className="space-y-2">
                  {['Instagram', 'LinkedIn', 'Twitter'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 transition-colors duration-200 hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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