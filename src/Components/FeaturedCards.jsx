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
      className="group relative h-full bg-white rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-xl overflow-hidden"
    >
      {isNew && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
          NEW
        </div>
      )}
      
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

  return (
    <section className="px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </div>
      
      
    </section>
  );
};

export default FeaturesSection;