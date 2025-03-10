import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Dumbbell, 
  List, 
  Plus, 
  Utensils, 
  MapPin,
  MoveRight,
  Zap,
  Target,
  ScrollText,
  Calendar,
  LineChart,
  Apple,
  Goal
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureSlider = ({ features }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
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
      timer = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, isHovering, nextSlide]);

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
                  isNew={feature.isNew}
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
                <span>Pause Slideshow</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play Slideshow</span>
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

const FeatureCard = ({ title, description, icon: Icon, link, isNew }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative h-full bg-white rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-xl overflow-hidden"
    >
      {isNew && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
          NEW
        </div>
      )}
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col h-full p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex justify-center items-center w-12 h-12 bg-sky-50 rounded-2xl transition-colors duration-300 group-hover:bg-sky-100">
            <Icon className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-300">
            {title}
          </h3>
        </div>

        <p className="text-sm leading-relaxed text-gray-600 flex-grow mb-6">
          {description}
        </p>

        <Link
          to={link}
          className="inline-flex justify-between items-center px-4 py-3 w-full text-sm text-white bg-sky-600 rounded-xl transition-colors duration-200 hover:bg-sky-700 group/button mt-auto"
        >
          <span>Get Started</span>
          <MoveRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover/button:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      image: "https://i.pinimg.com/originals/a0/d6/35/a0d635c33d9a31a1d3c4a6f6ab8c3e21.gif",
      icon: Dumbbell,
      title: "Browse Exercises",
      description: "Explore a comprehensive library of exercises categorized by muscle groups. Find detailed instructions, animations, and tips to perfect your form.",
      link: "/muscle"
    },
    {
      image: "https://i.pinimg.com/originals/8e/8a/99/8e8a99e5a5a5e0ca7a4f6b670f9d3a1c.gif",
      icon: List,
      title: "Workout Plans",
      description: "Access curated workout plans designed by fitness experts. From beginners to advanced athletes, find the perfect routine to achieve your goals.",
      link: "/plans"
    },
    {
      image: "https://i.pinimg.com/originals/60/77/fb/6077fb87e19f8738d539852db0e534bc.gif",
      icon: Plus,
      title: "Create Custom Plans",
      description: "Design your own personalized workout routines with our easy-to-use plan builder. Mix and match exercises to create the perfect workout for your specific needs and goals.",
      link: "/create-plan",
      isNew: true
    },
    {
      image: "https://i.pinimg.com/736x/aa/d3/4e/aad34e88c7cebbbfbbeb82b614d8eee1.jpg",
      icon: Utensils,
      title: "Diet Plans",
      description: "Get personalized diet plans that complement your workout routine. Our nutrition guidance helps you fuel your body properly and achieve optimal results.",
      link: "/diet"
    },
    {
      image: "https://i.pinimg.com/originals/e0/f3/73/e0f373000a27d99d4a4253db0f3a0af7.gif",
      icon: MapPin,
      title: "Find Nearby Gyms",
      description: "Discover fitness centers in your area to kickstart your fitness journey. We'll help you find the perfect gym based on your location.",
      link: "/nearby-gyms",
      isNew: true
    },
    {
      icon: Target,
      title: "Muscle Targeting",
      description: "Find specific exercises that target individual muscle groups for balanced, effective workouts.",
      link: "/muscle-groups"
    },
    {
      icon: ScrollText,
      title: "Exercise Splits",
      description: "Discover optimal workout splits tailored to your schedule and training preferences with ease and flexibility.",
      link: "/splits"
    },
    {
      icon: Calendar,
      title: "Pre-Made Plans",
      description: "Access professionally designed workout plans crafted by fitness experts.",
      link: "/premade-plans"
    },
    {
      icon: LineChart,
      title: "Progress Tracking",
      description: "Monitor your fitness journey with detailed progress tracking and analytics.",
      link: "/progress"
    }
  ];

  return (
    <section className="flex flex-col gap-16 justify-center items-center px-6 py-24 min-h-screen bg-gradient-to-br from-white to-gray-50 sm:px-16 lg:px-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4 text-center"
      >
        <h2 className="text-4xl font-bold sm:text-5xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">
            Explore Our
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-sky-600 to-sky-500">
            {" "}Features
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600">
          Discover powerful tools and resources designed to help you achieve your fitness goals
        </p>
      </motion.div>

      {/* Feature Slider */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <FeatureSlider features={features} />
      </motion.div>
      
      {/* View All Features Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <Link
          to="/all-features"
          className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-br from-blue-600 to-sky-600 rounded-full shadow-md sm:text-base hover:shadow-lg transition-all duration-300"
        >
          View All Features
          <MoveRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;