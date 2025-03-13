"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, PlayCircle, PauseCircle } from 'lucide-react';

const FeatureShowcase = ({ features = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Early return if no features
  if (!features || features.length === 0) {
    return null;
  }

  const nextSlide = useRef(() => {});

  nextSlide.current = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === features.length - 1 ? 0 : prevIndex + 1
    );
  }, [features.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? features.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && !isHovering) {
      timer = setInterval(() => nextSlide.current(), 5000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, isHovering]);

  return (
    <div 
      className="relative w-full h-[600px] md:h-[700px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-10 h-1 bg-gray-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 5, 
            ease: "linear",
            repeat: isPlaying ? Infinity : 0,
            repeatType: "loop"
          }}
          key={`progress-${currentIndex}`}
        />
      </div>

      {/* Main Slider */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          {features[currentIndex] && (
            <motion.div 
              key={currentIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Image with overlay */}
              <div className="relative w-full h-full">
                <motion.img 
                  src={features[currentIndex].image}
                  alt={features[currentIndex].title}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1.1, filter: "blur(10px)" }}
                  animate={{ scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.2 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/30" />
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-16">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    {features[currentIndex].icon && (
                      <motion.div 
                        className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-lg"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        {React.createElement(features[currentIndex].icon, {
                          className: "w-6 h-6 text-white"
                        })}
                      </motion.div>
                    )}
                    {features[currentIndex].isNew && (
                      <motion.span 
                        className="inline-block px-4 py-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                      >
                        New
                      </motion.span>
                    )}
                  </div>
                  
                  <motion.h2 
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {features[currentIndex].title}
                  </motion.h2>
                  
                  <motion.p 
                    className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {features[currentIndex].description}
                  </motion.p>
                  
                  {features[currentIndex].link && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <a 
                        href={features[currentIndex].link}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                      >
                        Learn More
                        <motion.span 
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                        >
                          →
                        </motion.span>
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Navigation arrows - more subtle and positioned better */}
        <div className="absolute inset-y-0 left-4 right-4 flex justify-between items-center pointer-events-none">
          <motion.button 
            onClick={prevSlide}
            className="flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/20 backdrop-blur-md text-white/90 border border-white/10 pointer-events-auto shadow-lg"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="sr-only">Previous slide</span>
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
          
          <motion.button 
            onClick={nextSlide}
            className="flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/20 backdrop-blur-md text-white/90 border border-white/10 pointer-events-auto shadow-lg"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="sr-only">Next slide</span>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </div>
        
        {/* Controls footer - redesigned */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 sm:p-6 md:p-8 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none">
          {/* Play/Pause button */}
          <motion.button
            onClick={toggleAutoplay}
            className="flex items-center gap-2 text-white/80 hover:text-white pointer-events-auto transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {isPlaying ? (
              <PauseCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </motion.button>
          
          {/* Dots navigation - enhanced */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 pointer-events-auto">
            {features.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  currentIndex === index 
                    ? 'w-6 sm:w-8 bg-white shadow-glow' 
                    : 'w-1.5 sm:w-2 bg-white/30 hover:bg-white/60'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Slide counter - redesigned */}
          <motion.div 
            className="absolute top-6 right-6 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-white/90 text-xs font-medium border border-white/10 shadow-lg"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {currentIndex + 1} / {features.length}
          </motion.div>
        </div>
      </div>
      
      {/* Add subtle particle effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Add custom styles */}
      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

FeatureShowcase.defaultProps = {
  features: []
};

export default FeatureShowcase;
