import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const AdvancedFeatureSlider = ({ features, autoplay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [width, setWidth] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const itemsToShow = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
  const totalSlides = Math.ceil(features.length / itemsToShow);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
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
      timer = setInterval(nextSlide, interval);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, isHovering, nextSlide, interval]);

  return (
    <div 
      className="relative w-full overflow-hidden py-12"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/30 pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-4 right-4 z-10 flex justify-between items-center -translate-y-1/2 pointer-events-none">
          <button 
            onClick={prevSlide}
            className="flex justify-center items-center w-10 h-10 text-blue-600 bg-white rounded-full shadow-md pointer-events-auto transform transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="flex justify-center items-center w-10 h-10 text-blue-600 bg-white rounded-full shadow-md pointer-events-auto transform transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Slider Container */}
        <div className="overflow-hidden px-8">
          <motion.div 
            className="flex transition-all duration-500 ease-out"
            animate={{ x: -currentIndex * 100 + '%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`flex-none w-full ${itemsToShow === 3 ? 'lg:w-1/3' : ''} ${itemsToShow >= 2 ? 'sm:w-1/2' : ''} p-4`}
              >
                <FeatureCard 
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  link={feature.link}
                />
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Controls and Indicators */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center px-4">
          {/* Autoplay Toggle */}
          <button
            onClick={toggleAutoplay}
            className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-4 sm:mb-0"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play</span>
              </>
            )}
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'bg-blue-600 w-6' : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon: Icon, link }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-transparent" />
        <div className="absolute h-32 w-32 -right-8 -bottom-8 bg-blue-50 rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed flex-grow">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-1 text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Explore</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedFeatureSlider;