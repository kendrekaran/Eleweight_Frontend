"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, PlayCircle, PauseCircle } from 'lucide-react';

const FeatureShowcase = ({ features = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return; // Prevent multiple transitions
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === features.length - 1 ? 0 : prevIndex + 1
    );
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700); // Match with animation duration
  }, [features.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return; // Prevent multiple transitions
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? features.length - 1 : prevIndex - 1
    );
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700); // Match with animation duration
  }, [features.length, isTransitioning]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  }, [currentIndex, isTransitioning]);

  const toggleAutoplay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Reset timer when changing slides manually
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (isPlaying && !isHovering && features.length > 1) {
      timerRef.current = setInterval(nextSlide, 3000);
    }
  }, [features.length, isHovering, isPlaying, nextSlide]);

  // Setup auto-scrolling with 3-second interval
  useEffect(() => {
    resetTimer();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isHovering, resetTimer]);
  
  // Reset timer when manually changing slides
  useEffect(() => {
    resetTimer();
  }, [currentIndex, resetTimer]);

  // Log for debugging
  useEffect(() => {
    console.log("Current slide index:", currentIndex);
  }, [currentIndex]);

  // Early return if no features
  if (!features || features.length === 0) {
    return null;
  }

  // Handler functions that ensure function call
  const handlePrevClick = (e) => {
    e.stopPropagation();
    console.log("Previous button clicked");
    prevSlide();
  };

  const handleNextClick = (e) => {
    e.stopPropagation();
    console.log("Next button clicked");
    nextSlide();
  };

  return (
    <div 
      className="relative w-full h-[600px] md:h-[700px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Progress bar - updated to 3 seconds */}
      <div className="absolute top-0 right-0 left-0 z-10 h-1 bg-gray-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 3,
            ease: "linear",
            repeat: isPlaying ? Infinity : 0,
            repeatType: "loop"
          }}
          key={`progress-${currentIndex}`}
        />
      </div>

      {/* Main Slider */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" initial={false}>
          {features[currentIndex] && (
            <motion.div 
              key={currentIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {/* Image with overlay */}
              <div className="relative w-full h-full">
                <motion.img 
                  src={features[currentIndex].image}
                  alt={features[currentIndex].title}
                  className="object-cover absolute inset-0 w-full h-full"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/30" />
              </div>

              {/* Content overlay - simplified animations */}
              <div className="flex absolute inset-0 flex-col justify-end p-6 sm:p-10 md:p-16">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="max-w-3xl"
                >
                  <div className="flex gap-4 items-center mb-6">
                    {features[currentIndex].icon && (
                      <motion.div 
                        className="p-3 rounded-xl border shadow-lg backdrop-blur-md bg-white/10 border-white/10"
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
                    className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {features[currentIndex].title}
                  </motion.h2>
                  
                  <motion.p 
                    className="mb-8 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg"
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
                        className="inline-flex items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
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
        
        {/* Navigation arrows - improved for better interaction */}
        <div className="flex absolute inset-y-0 right-4 left-4 z-20 justify-between items-center">
          <button 
            onClick={handlePrevClick}
            className="flex justify-center items-center w-12 h-12 text-white rounded-full border shadow-lg transition-all cursor-pointer bg-black/40 border-white/20 hover:bg-black/60"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={handleNextClick}
            className="flex justify-center items-center w-12 h-12 text-white rounded-full border shadow-lg transition-all cursor-pointer bg-black/40 border-white/20 hover:bg-black/60"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        {/* Controls footer */}
        <div className="flex absolute right-0 bottom-0 left-0 justify-between items-center p-4 bg-gradient-to-t to-transparent pointer-events-none sm:p-6 md:p-8 from-slate-950 via-slate-950/80">
          {/* Play/Pause button */}
          <motion.button
            onClick={toggleAutoplay}
            className="flex gap-2 items-center transition-colors pointer-events-auto text-white/80 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isPlaying ? (
              <PauseCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
            <span className="hidden text-xs font-medium sm:text-sm sm:inline">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </motion.button>
          
          {/* Dots navigation - improved interaction */}
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
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.03 }}
                aria-label={`Go to slide ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>
          
          {/* Slide counter */}
          <motion.div 
            className="absolute top-6 right-6 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-white/90 text-xs font-medium border border-white/10 shadow-lg"
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentIndex + 1} / {features.length}
          </motion.div>
        </div>
      </div>
      
      {/* Simplified particle effect for better performance */}
      <div className="overflow-hidden absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      
      {/* Custom styles */}
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