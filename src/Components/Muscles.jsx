import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Target, PlayCircle, Info } from 'lucide-react';
import exercisesData from '../exercises.json';
import NavBar from './NavBar';

const Card = ({ index, title, muscle, gif_url, onSelect }) => {
  return (
    <motion.div
      layoutId={`exercise-${index}`}
      className="group bg-white hover:bg-gray-50 shadow-sm hover:shadow-xl rounded-2xl cursor-pointer 
                 transition-all duration-300 overflow-hidden"
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="p-6 flex flex-col sm:flex-row gap-6 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative w-full sm:w-32 h-60 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
          <img 
            src={gif_url} 
            alt={title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <PlayCircle className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{muscle}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mt-4">
            <span>View details</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FullScreenCard = ({ exercise, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl h-full sm:h-auto overflow-y-auto sm:overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="relative">
          {/* Header */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 bg-gray-100 p-8 flex items-center justify-center">
              <div className="relative group">
                <img
                  src={exercise.gif_url}
                  className="max-w-full max-h-[50vh] object-contain rounded-xl"
                  alt={exercise.name}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-1/2 p-8">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{exercise.name}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>Target Muscle: {exercise.muscle}</span>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Instructions */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Instructions</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <p className="text-gray-600">{exercise.description1}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <p className="text-gray-600">{exercise.description2}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MuscleExercises = () => {
  const { muscle } = useParams();
  const [exercises, setExercises] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (exercisesData.exercises && exercisesData.exercises[muscle]) {
      setExercises(exercisesData.exercises[muscle]);
    }
  }, [muscle]);

  const selectedExercise = selectedIndex !== null ? exercises[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {muscle.charAt(0).toUpperCase() + muscle.slice(1)} Exercises
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <Card
                key={index}
                index={index}
                title={exercise.name}
                muscle={exercise.muscle}
                gif_url={exercise.gif_url}
                description={`${exercise.description1} ${exercise.description2 || ''}`}
                onSelect={() => setSelectedIndex(index)}
              />
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-12">
              <div className="p-4 rounded-full bg-gray-100">
                <Info className="w-8 h-8 text-gray-400" />
              </div>
              <p className="mt-4 text-gray-600 text-lg">No exercises found for this muscle group.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <FullScreenCard
            exercise={selectedExercise}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MuscleExercises;




