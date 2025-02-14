import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Target,
  ScrollText,
  Dumbbell,
  Calendar,
  LineChart,
  Apple,
  Goal,
  Play,
} from "lucide-react";

const Card = ({ title, description, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true, amount: 0.3 }}
      className="group relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
    >

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

        <motion.div
          className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium cursor-pointer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
        </motion.div>
      </div>
    </motion.div>
  );
};

const FeatureCards = () => {
  const features = [
    {
      title: "Explore Exercises",
      description:
        "Browse through our comprehensive library of exercises suitable for all skill levels and fitness goals.",
      icon: Dumbbell,
    },
    {
      title: "Muscle Targeting",
      description:
        "Find specific exercises that target individual muscle groups for balanced, effective workouts.",
      icon: Target,
    },
    {
      title: "Exercise Splits",
      description:
        "Discover optimal workout splits tailored to your schedule and training preferences with ease and flexibility.",
      icon: ScrollText,
    },
    {
      title: "Custom Plans",
      description:
        "Create personalized workout plans that align perfectly with your fitness objectives.",
      icon: Zap,
    },
    {
      title: "Pre-Made Plans",
      description:
        "Access professionally designed workout plans crafted by fitness experts.",
      icon: Calendar,
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor your fitness journey with detailed progress tracking and analytics.",
      icon: LineChart,
    },
    {
      title: "Nutrition Guide",
      description:
        "Get expert nutrition guidance to complement your training and maximize results.",
      icon: Apple,
    },
    {
      title: "Goal Setting",
      description:
        "Set ambitious fitness goals and track your progress toward achieving them.",
      icon: Goal,
    },
    {
      title: "Video Tutorials",
      description:
        "Learn perfect form with our comprehensive library of exercise video tutorials.",
      icon: Play,
    },
  ];

  return (
    <div className="w-full  py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card {...feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureCards;
