import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Target, ChevronRight, Info, PlayCircle, X, ArrowLeft, Dumbbell, Clock } from 'lucide-react';
import NavBar from '../Components/NavBar';

const FullScreenCard = ({ exercise, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl h-full sm:h-auto overflow-y-auto sm:overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-gray-100 transition-all duration-200 hover:rotate-90"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-sky-50 p-8 flex items-center justify-center">
              <div className="relative group">
                <img
                  src={exercise.gif_url}
                  className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-lg"
                  alt={exercise.name}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl" />
              </div>
            </div>

            <div className="w-full lg:w-1/2 p-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-sky-500 shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{exercise.name}</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl">
                      <Dumbbell className="w-5 h-5 text-blue-500" />
                      <span>Target Muscle: {exercise.muscle}</span>
                    </div>
                    {exercise.sets && exercise.reps && (
                      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span>Sets × Reps: {exercise.sets} × {exercise.reps}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {(exercise.description1 || exercise.description2) && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Instructions</h3>
                    <div className="space-y-4">
                      {exercise.description1 && (
                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 text-white flex items-center justify-center text-sm font-medium shadow-md">
                            1
                          </div>
                          <p className="text-gray-600">{exercise.description1}</p>
                        </div>
                      )}
                      {exercise.description2 && (
                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 text-white flex items-center justify-center text-sm font-medium shadow-md">
                            2
                          </div>
                          <p className="text-gray-600">{exercise.description2}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DayCard = ({ day, exerciseCount, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/5 group-hover:to-blue-500/0 transition-colors duration-300" />
      <div className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-sky-500 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize group-hover:text-blue-600 transition-colors duration-300">
                {day.replace('day', 'Day ')}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

const ExerciseList = ({ day, exercises, onBack, onSelectExercise }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 "
    >
      <div className="flex items-center gap-4 ">
        <button
          onClick={onBack}
          className="p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-blue-600" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 capitalize">
          {day.replace('day', 'Day ')} Exercises
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {exercises.map((exercise, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white md:w-96  hover:bg-gray-50 shadow-lg hover:shadow-xl rounded-xl p-4 transition-all duration-300 cursor-pointer border border-gray-100 "
            onClick={() => onSelectExercise(exercise)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/5 group-hover:to-blue-500/0 transition-colors duration-300 rounded-xl" />
            <div className="flex items-start gap-6 relative">
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <img
                  src={exercise.gif_url}
                  alt={exercise.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              <div className="flex-grow py-2">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {exercise.name}
                </h3>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{exercise.muscle}</span>
                  </div>
                  {exercise.sets && exercise.reps && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <ChevronRight className="w-6 h-6 text-blue-500 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const WorkoutPlan = () => {
  const location = useLocation();
  const { exercises } = location.state || {};
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  if (!exercises) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-white shadow-lg">
              <Info className="w-8 h-8 text-gray-400" />
            </div>
            <p className="mt-4 text-gray-600 text-lg">No workout plan selected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Your Workout Plan
            </h1>
            <p className="text-gray-500">Stay consistent, stay strong</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 ">
        <AnimatePresence mode="wait">
          {!selectedDay ? (
            <motion.div
              key="days"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Object.entries(exercises).map(([day, dayExercises]) => (
                <DayCard
                  key={day}
                  day={day}
                  exerciseCount={dayExercises.length}
                  onClick={() => setSelectedDay(day)}
                />
              ))}
            </motion.div>
          ) : (
            <ExerciseList
              key="exercises"
              day={selectedDay}
              exercises={exercises[selectedDay]}
              onBack={() => setSelectedDay(null)}
              onSelectExercise={setSelectedExercise}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedExercise && (
          <FullScreenCard
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutPlan;