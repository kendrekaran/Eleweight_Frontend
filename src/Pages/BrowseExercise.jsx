import React, { useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../Components/NavBar';
import { Dumbbell, Trophy, ChevronRight, Target } from 'lucide-react';

const MuscleCard = ({ to, imageSrc, title, exercises, difficulty, benefits }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
     
    <Link 
      to={to} 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      
      <div className="aspect-w-16 aspect-h-12">
        <img
          className="w-full h-full sm:w-96 sm:h-64 rounded-3xl object-cover transition-transform duration-500 "
          src={imageSrc}
          alt={`${title} Exercises`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="flex items-center gap-2 mb-28 ml-44 text-blue-400 transition-transform duration-300 transform translate-y-0 opacity-0 group-hover:-translate-y-2 group-hover:opacity-100">
            <span>Explore exercises</span>
            <ChevronRight className="w-5 h-5" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
          
            <h3 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
              {title}
            </h3>
            <span className="bg-blue-500/20 backdrop-blur-sm text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
              {exercises} exercises
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Trophy className="w-4 h-4 text-blue-400" />
              <span>{difficulty}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Target className="w-4 h-4 text-blue-400" />
              <span>{benefits}</span>
            </div>
          </div>

          
        </div>
      </div>

      <div className="absolute top-4 left-4">
        <div className="bg-blue-600/10 backdrop-blur-sm p-2 rounded-xl">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
      </div>
    </Link>
  </motion.div>
);

const BrowseExercise = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
    useEffect(() => {
      if (!token) {
        navigate("/login");
      }
    }, [token, Navigate]);
  
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const muscles = [
    {
      id: 'chest',
      title: 'Chest',
      image: 'https://i.pinimg.com/474x/52/86/62/5286624abd2910a4f11157be790fafd9.jpg',
      exercises: '12',
      difficulty: 'Intermediate',
      benefits: 'Upper Body Strength'
    },
    {
      id: 'back',
      title: 'Back',
      image: 'https://i.pinimg.com/474x/ad/1d/cd/ad1dcdec4554e11afd0961795b6984f1.jpg',
      exercises: '15',
      difficulty: 'Advanced',
      benefits: 'Posture & Power'
    },
    {
      id: 'shoulders',
      title: 'Shoulders',
      image: 'https://i.pinimg.com/474x/9a/f4/ed/9af4edf7dfea3b33aa498007aaf5e173.jpg',
      exercises: '10',
      difficulty: 'All Levels',
      benefits: '3D Definition'
    },
    {
      id: 'arms',
      title: 'Arms',
      image: 'https://i.pinimg.com/474x/94/fc/97/94fc978575c901e4e40dee99c762a923.jpg',
      exercises: '14',
      difficulty: 'Beginner',
      benefits: 'Muscle Growth'
    },
    {
      id: 'core',
      title: 'Core',
      image: 'https://i.pinimg.com/474x/1e/cd/a9/1ecda9a944ff50c39ef0de25b6813347.jpg',
      exercises: '16',
      difficulty: 'All Levels',
      benefits: 'Stability & Strength'
    },
    {
      id: 'legs',
      title: 'Legs',
      image: 'https://i.pinimg.com/474x/50/b7/f8/50b7f82b56a8796932911e5753328682.jpg',
      exercises: '18',
      difficulty: 'Advanced',
      benefits: 'Power & Size'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Target Your
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {" "}Muscle Groups
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Select a muscle group to discover targeted exercises and build your perfect workout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {muscles.map((muscle, index) => (
            <MuscleCard
              key={muscle.id}
              to={`/muscle/${muscle.id}`}
              imageSrc={muscle.image}
              title={muscle.title}
              exercises={muscle.exercises}
              difficulty={muscle.difficulty}
              benefits={muscle.benefits}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseExercise;