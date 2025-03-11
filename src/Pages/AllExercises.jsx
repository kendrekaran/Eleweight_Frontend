import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../Components/NavBar';
import { exercises } from '../exercises.json';
import { Search, Filter, X, ChevronDown, ChevronUp, Dumbbell, Info, Plus } from 'lucide-react';

const AllExercises = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    // Flatten the exercises object into an array
    const exerciseArray = [];
    Object.entries(exercises).forEach(([muscleGroup, exerciseList]) => {
      exerciseList.forEach(exercise => {
        exerciseArray.push({
          ...exercise,
          muscleGroup
        });
      });
    });
    setAllExercises(exerciseArray);
  }, []);

  const muscleGroups = Object.keys(exercises);

  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle ? exercise.muscleGroup === selectedMuscle : true;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="container px-4 mx-auto">
        <div className="sticky top-0 z-30 p-6 mb-8 bg-white rounded-xl shadow-md">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-grow">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block py-3 pr-3 pl-10 w-full bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex justify-between items-center px-4 py-3 w-full bg-white rounded-lg border border-gray-300 shadow-sm md:w-48 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <div className="flex items-center">
                  <Filter className="mr-2 w-5 h-5 text-gray-400" />
                  <span>{selectedMuscle || 'Filter Muscle'}</span>
                </div>
                {isFilterOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {isFilterOpen && (
                <div className="absolute z-40 mt-1 w-full bg-white rounded-lg border border-gray-300 shadow-lg">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedMuscle('');
                        setIsFilterOpen(false);
                      }}
                      className="flex items-center px-3 py-2 w-full text-left rounded-md hover:bg-gray-100"
                    >
                      <span>All muscles</span>
                    </button>
                    {muscleGroups.map((muscle) => (
                      <button
                        key={muscle}
                        onClick={() => {
                          setSelectedMuscle(muscle);
                          setIsFilterOpen(false);
                        }}
                        className="flex items-center px-3 py-2 w-full text-left rounded-md hover:bg-gray-100"
                      >
                        <span>{muscle.charAt(0).toUpperCase() + muscle.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedMuscle && (
            <div className="flex items-center mt-4">
              <span className="mr-2 text-sm text-gray-500">Filtered by:</span>
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
                {selectedMuscle.charAt(0).toUpperCase() + selectedMuscle.slice(1)}
                <button
                  onClick={() => setSelectedMuscle('')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            {filteredExercises.length} {filteredExercises.length === 1 ? 'Exercise' : 'Exercises'} Found
          </h2>
          <p className="text-gray-600">
            Click on any exercise to view details and add it to your custom workout plan
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredExercises.map((exercise, index) => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              index={index}
              onClick={() => setSelectedExercise(exercise)}
            />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="py-16 text-center bg-gray-50 rounded-xl border-2 border-gray-300 border-dashed">
            <Dumbbell className="mx-auto mb-4 w-16 h-16 text-gray-400" />
            <p className="mb-4 text-lg text-gray-500">No exercises found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMuscle('');
              }}
              className="px-6 py-3 text-white bg-purple-500 rounded-lg transition-colors hover:bg-purple-600"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="flex overflow-y-auto fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="overflow-hidden my-8 w-full max-w-4xl bg-white rounded-xl shadow-xl"
          >
            <div className="relative">
              <button
                onClick={() => setSelectedExercise(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 bg-white/90 hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              <div className="flex flex-col lg:flex-row max-h-[80vh] overflow-y-auto">
                <div className="flex justify-center items-center p-8 w-full bg-gradient-to-br from-purple-50 to-sky-50 lg:w-1/2">
                  <div className="relative group">
                    <img
                      src={selectedExercise.gif_url}
                      className="max-w-full max-h-[40vh] object-contain rounded-xl shadow-lg"
                      alt={selectedExercise.name}
                    />
                  </div>
                </div>

                <div className="overflow-y-auto p-8 w-full lg:w-1/2">
                  <div className="space-y-6">
                    <div>
                      <div className="flex gap-3 items-center mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Dumbbell className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedExercise.name}</h2>
                      </div>
                      <div className="flex items-center">
                        <span className="px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
                          {selectedExercise.muscleGroup.charAt(0).toUpperCase() + selectedExercise.muscleGroup.slice(1)}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-600">{selectedExercise.muscle}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-800">Instructions</h3>
                      <div className="space-y-2 text-gray-600">
                        <p>{selectedExercise.description1}</p>
                        <p>{selectedExercise.description2}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          navigate('/create-plan');
                          setSelectedExercise(null);
                        }}
                        className="flex justify-center items-center py-3 w-full text-white bg-purple-500 rounded-lg transition-colors hover:bg-purple-600"
                      >
                        <Plus className="mr-2 w-5 h-5" />
                        Add to Custom Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const ExerciseCard = ({ exercise, index, onClick }) => {
  return (
    <motion.div
      className="overflow-hidden bg-white rounded-xl shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg group"
      onClick={onClick}
    >
      <div className="flex flex-row sm:flex-row md:flex-col">
        <div className="overflow-hidden relative w-24 h-24 bg-gray-200 sm:h-24 sm:w-24 md:w-full md:h-48">
          <img
            src={exercise.gif_url}
            alt={exercise.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 from-black/60 group-hover:opacity-100"></div>
          <div className="absolute right-3 bottom-3 p-2 rounded-full opacity-0 backdrop-blur-sm transition-opacity duration-300 bg-white/90 group-hover:opacity-100">
            <Info className="w-4 h-4 text-purple-500" />
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex flex-col justify-between items-start mb-2 sm:flex-row md:flex-col">
            <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600 line-clamp-1">{exercise.name}</h3>
            <span className="px-2 py-1 mt-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full sm:mt-0 md:mt-1">
              {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)}
            </span>
          </div>
          <p className="mb-3 text-sm text-gray-600 line-clamp-1 sm:line-clamp-1 md:line-clamp-2">
            {exercise.description1}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {exercise.muscle}
            </span>
            <span className="text-xs font-medium text-purple-500 group-hover:underline">View details</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AllExercises; 