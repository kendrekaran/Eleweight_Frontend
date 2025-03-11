import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeatureShowcase = ({ features = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayTimerRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayTimerRef.current = setInterval(() => {
        if (!isHovering) {
          setCurrentIndex((prevIndex) => 
            prevIndex === features.length - 1 ? 0 : prevIndex + 1
          );
        }
      }, 5000); // Change slide every 5 seconds
    };

    startAutoPlay();

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isHovering, features.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === features.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? features.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Early return if no features
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-white rounded-2xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Slider */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          {features[currentIndex] && (
            <motion.div 
              key={currentIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {/* Image with overlay */}
              <div className="relative w-full h-full">
                <motion.img 
                  src={features[currentIndex].image}
                  alt={features[currentIndex].title}
                  className="object-cover absolute inset-0 w-full h-full"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/30" />
              </div>

              {/* Content overlay - Improved responsive layout */}
              <div className="flex absolute inset-0 flex-col justify-end p-4 sm:p-6 md:p-10 lg:p-16">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mx-auto w-full max-w-3xl"
                >
                  <div className="flex flex-wrap gap-3 items-center mb-4 sm:gap-4 sm:mb-6">
                    {features[currentIndex].icon && (
                      <div className="p-2 rounded-xl border shadow-lg backdrop-blur-md sm:p-3 bg-white/10 border-white/10">
                        {React.createElement(features[currentIndex].icon, {
                          className: "w-5 h-5 sm:w-6 sm:h-6 text-white"
                        })}
                      </div>
                    )}
                    {features[currentIndex].isNew && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg">
                        New
                      </span>
                    )}
                  </div>
                  
                  <h2 className="mb-3 text-2xl font-bold tracking-tight text-white sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
                    {features[currentIndex].title}
                  </h2>
                  
                  <p className="mb-6 max-w-2xl text-sm leading-relaxed text-gray-300 sm:mb-8 sm:text-base md:text-lg">
                    {features[currentIndex].description}
                  </p>
                  
                  {features[currentIndex].link && (
                    <a 
                      href={features[currentIndex].link}
                      className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                      Learn More
                      <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Navigation arrows - Improved positioning and styling */}
        <div className="flex absolute inset-y-0 right-4 left-4 z-20 justify-between items-center pointer-events-none">
          <button 
            onClick={prevSlide}
            className="flex justify-center items-center w-10 h-10 text-white rounded-full border shadow-lg backdrop-blur-md transition-all cursor-pointer pointer-events-auto sm:w-12 sm:h-12 bg-black/20 border-white/10 hover:bg-black/30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="flex justify-center items-center w-10 h-10 text-white rounded-full border shadow-lg backdrop-blur-md transition-all cursor-pointer pointer-events-auto sm:w-12 sm:h-12 bg-black/20 border-white/10 hover:bg-black/30"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Dots navigation */}
        <div className="flex absolute right-0 left-0 bottom-4 z-20 gap-2 justify-center">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

FeatureShowcase.defaultProps = {
  features: []
};

export default FeatureShowcase;