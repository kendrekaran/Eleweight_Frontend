import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  List, 
  Plus, 
  Utensils, 
  MapPin,
  MoveRight,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ title, description, icon: Icon, link, isNew }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="overflow-hidden relative h-full bg-white rounded-2xl border shadow-sm transition-all duration-300 group hover:shadow-xl"
    >
      {/* Decorative top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />
      
      {isNew && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg">
          NEW
        </div>
      )}
      
      {/* Hover background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex relative z-10 flex-col p-6 h-full">
        {/* Icon with improved styling */}
        <div className="mb-5">
          <div className="inline-flex justify-center items-center w-14 h-14 bg-indigo-50 rounded-xl shadow-sm transition-colors duration-300 group-hover:bg-indigo-100">
            <Icon className="w-7 h-7 text-indigo-600" />
          </div>
        </div>
        
        {/* Title with hover effect */}
        <h3 className="mb-3 text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-indigo-600">
          {title}
        </h3>

        {/* Description */}
        <p className="flex-grow mb-6 text-sm leading-relaxed text-gray-600">
          {description}
        </p>

        {/* Button with improved styling */}
        <Link
          to={link}
          className="inline-flex justify-between items-center px-5 py-3.5 w-full text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 shadow-sm hover:shadow-md mt-auto"
        >
          <span>Get Started</span>
          <MoveRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Dumbbell,
      title: "Browse Exercises",
      description: "Explore a comprehensive library of exercises categorized by muscle groups. Find detailed instructions, animations, and tips to perfect your form.",
      link: "/exercises"
    },
    {
      icon: List,
      title: "Workout Plans",
      description: "Access curated workout plans designed by fitness experts. From beginners to advanced athletes, find the perfect routine to achieve your goals.",
      link: "/plans"
    },
    {
      icon: Plus,
      title: "Create Custom Plans",
      description: "Design your own personalized workout routines with our easy-to-use plan builder. Mix and match exercises to create the perfect workout for your specific needs and goals.",
      link: "/create-plan",
      isNew: true
    },
    {
      icon: Utensils,
      title: "Diet Plans",
      description: "Get personalized diet plans that complement your workout routine. Our nutrition guidance helps you fuel your body properly and achieve optimal results.",
      link: "/diet"
    },
    {
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
      link: "/muscle"
    }
  ];

  // State for slider
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const sliderRef = React.useRef(null);
  
  // Number of cards to show based on screen size
  const getVisibleCards = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 3; // xl screens
      if (window.innerWidth >= 768) return 2; // md screens
      return 1; // small screens
    }
    return 3; // Default for SSR
  };
  
  const [visibleCards, setVisibleCards] = React.useState(3);
  
  React.useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const maxIndex = Math.max(0, features.length - visibleCards);
  
  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };
  
  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };
  
  const goToSlide = (index) => {
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  };

  return (
    <section className="px-6">
      <div className="relative">
        {/* Slider container */}
        <div className="overflow-hidden">
          <div 
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex-shrink-0 p-3 w-full md:w-1/2 xl:w-1/3`}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex gap-4 justify-center items-center mt-10">
          {/* Previous button */}
          <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full bg-white shadow-md transition-all ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50'
            }`}
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          
          {/* Dots navigation */}
          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentIndex === idx 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
          {/* Next button */}
          <button 
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className={`p-3 rounded-full bg-white shadow-md transition-all ${
              currentIndex === maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50'
            }`}
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;