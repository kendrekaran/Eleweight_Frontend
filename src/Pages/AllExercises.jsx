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

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 sticky top-0 z-30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between w-full md:w-48 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-400 mr-2" />
                  <span>{selectedMuscle || 'Filter Muscle'}</span>
                </div>
                {isFilterOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {isFilterOpen && (
                <div className="absolute z-40 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedMuscle('');
                        setIsFilterOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-gray-100"
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
                        className="flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-gray-100"
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
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500 mr-2">Filtered by:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {selectedMuscle.charAt(0).toUpperCase() + selectedMuscle.slice(1)}
                <button
                  onClick={() => setSelectedMuscle('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredExercises.length} {filteredExercises.length === 1 ? 'Exercise' : 'Exercises'} Found
          </h2>
          <p className="text-gray-600">
            Click on any exercise to view details and add it to your custom workout plan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No exercises found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMuscle('');
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="relative">
              <button
                onClick={() => setSelectedExercise(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-gray-100 transition-all duration-200"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-sky-50 p-8 flex items-center justify-center">
                  <div className="relative group">
                    <img
                      src={selectedExercise.gif_url}
                      className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-lg"
                      alt={selectedExercise.name}
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/2 p-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Dumbbell className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedExercise.name}</h2>
                      </div>
                      <div className="flex items-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {selectedExercise.muscleGroup.charAt(0).toUpperCase() + selectedExercise.muscleGroup.slice(1)}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-600">{selectedExercise.muscle}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions</h3>
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
                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                      >
                        <Plus className="h-5 w-5 mr-2" />
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={exercise.gif_url}
          alt={exercise.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Info className="w-4 h-4 text-blue-500" />
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{exercise.name}</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {exercise.description1}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {exercise.muscle}
          </span>
          <span className="text-xs text-blue-500 font-medium group-hover:underline">View details</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AllExercises; 