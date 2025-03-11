import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../Components/NavBar';
import { exercises } from '../exercises.json';
import { Plus, Trash2, Save, X, Calendar, ChevronDown, ChevronUp, Search } from 'lucide-react';
import axios from 'axios';

const CustomPlan = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [days, setDays] = useState([{ name: 'Day 1', exercises: [] }]);
  const [activeDay, setActiveDay] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allExercises, setAllExercises] = useState([]);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

  const addDay = () => {
    setDays([...days, { name: `Day ${days.length + 1}`, exercises: [] }]);
    setActiveDay(days.length);
  };

  const removeDay = (index) => {
    if (days.length > 1) {
      const newDays = days.filter((_, i) => i !== index);
      setDays(newDays);
      if (activeDay >= index && activeDay > 0) {
        setActiveDay(activeDay - 1);
      }
    }
  };

  const addExerciseToDay = (exercise) => {
    const newExercise = {
      ...exercise,
      sets: 3,
      reps: 10
    };
    
    const newDays = [...days];
    newDays[activeDay].exercises.push(newExercise);
    setDays(newDays);
  };

  const removeExerciseFromDay = (dayIndex, exerciseIndex) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setDays(newDays);
  };

  const updateExerciseDetails = (dayIndex, exerciseIndex, field, value) => {
    const newDays = [...days];
    newDays[dayIndex].exercises[exerciseIndex][field] = value;
    setDays(newDays);
  };

  const updateDayName = (index, name) => {
    const newDays = [...days];
    newDays[index].name = name;
    setDays(newDays);
  };

  const savePlan = async () => {
    if (!planName.trim()) {
      setError('Please enter a plan name');
      return;
    }

    if (days.some(day => day.exercises.length === 0)) {
      setError('Each day must have at least one exercise');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Ensure token is valid
      if (!token) {
        setError('You must be logged in to save a workout plan');
        setIsSaving(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/workout-plans`,
        {
          name: planName,
          description: planDescription,
          days
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('Workout plan saved successfully!');
      setTimeout(() => {
        navigate('/my-plans');
      }, 2000);
    } catch (error) {
      console.error('Error saving workout plan:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.values(validationErrors).join(', ');
        setError(`Validation error: ${errorMessage}`);
      } else {
        setError(error.response?.data?.message || 'Failed to save workout plan');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container px-4 py-4 mx-auto sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">Create Custom Workout Plan</h1>
          <p className="text-sm text-gray-600 sm:text-base">Design your own workout routine with exercises from our library</p>
        </motion.div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md border border-red-400 sm:p-4 sm:text-base">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-md border border-green-400 sm:p-4 sm:text-base">
            {success}
          </div>
        )}

        <div className="p-4 mb-6 bg-white rounded-xl shadow-md sm:p-6 sm:mb-8">
          <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6">
            <div>
              <label htmlFor="planName" className="block mb-1 text-sm font-medium text-gray-700">
                Plan Name
              </label>
              <input
                type="text"
                id="planName"
                className="px-3 py-2 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:px-4"
                placeholder="My Custom Plan"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="planDescription" className="block mb-1 text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <input
                type="text"
                id="planDescription"
                className="px-3 py-2 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:px-4"
                placeholder="A brief description of your plan"
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between items-start mb-4 sm:flex-row sm:items-center">
            <h2 className="mb-2 text-lg font-semibold text-gray-800 sm:mb-0 sm:text-xl">Workout Days</h2>
            <button
              onClick={addDay}
              className="flex items-center px-3 py-1.5 text-sm text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600 sm:py-2"
            >
              <Plus className="mr-1 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Add Day
            </button>
          </div>

          <div className="flex overflow-x-auto flex-wrap gap-2 pb-2 mb-6">
            {days.map((day, index) => (
              <div
                key={index}
                className={`relative group ${
                  activeDay === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } rounded-lg px-3 py-1.5 text-sm cursor-pointer transition-colors sm:px-4 sm:py-2 flex-shrink-0`}
              >
                <div className="flex items-center" onClick={() => setActiveDay(index)}>
                  <Calendar className="mr-1.5 w-3.5 h-3.5 sm:mr-2 sm:w-4 sm:h-4" />
                  <span>{day.name}</span>
                </div>
                {days.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDay(index);
                    }}
                    className="absolute -top-1 -right-1 p-0.5 text-white bg-red-500 rounded-full opacity-0 transition-opacity group-hover:opacity-100 sm:-top-2 sm:-right-2 sm:p-1"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex flex-col justify-between items-start mb-4 sm:flex-row sm:items-center">
              <div className="flex items-center mb-2 w-full sm:mb-0 sm:w-auto">
                <input
                  type="text"
                  value={days[activeDay].name}
                  onChange={(e) => updateDayName(activeDay, e.target.value)}
                  className="text-base font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none sm:text-lg"
                />
                <span className="ml-2 text-sm text-gray-500 sm:text-base">({days[activeDay].exercises.length} exercises)</span>
              </div>
              <button
                onClick={() => setIsExerciseModalOpen(true)}
                className="flex items-center px-3 py-1.5 text-sm text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600 sm:px-3 sm:py-2"
              >
                <Plus className="mr-1 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Add Exercise
              </button>
            </div>

            {days[activeDay].exercises.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed sm:py-12">
                <p className="text-sm text-gray-500 sm:text-base">No exercises added to this day yet.</p>
                <button
                  onClick={() => setIsExerciseModalOpen(true)}
                  className="px-3 py-1.5 mt-3 text-sm text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600 sm:px-4 sm:py-2 sm:mt-4"
                >
                  Add your first exercise
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {days[activeDay].exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:border-blue-300 sm:p-4"
                  >
                    <div className="flex flex-col justify-between mb-3 sm:flex-row sm:items-center sm:mb-4">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <img
                          src={exercise.gif_url}
                          alt={exercise.name}
                          className="object-cover mr-3 w-10 h-10 rounded-md sm:mr-4 sm:w-12 sm:h-12"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 sm:text-base">{exercise.name}</h3>
                          <span className="text-xs text-gray-500 sm:text-sm">{exercise.muscle}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeExerciseFromDay(activeDay, index)}
                        className="self-end text-red-500 transition-colors sm:self-center hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-700 sm:text-sm">
                          Sets
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExerciseDetails(activeDay, index, 'sets', parseInt(e.target.value) || 1)}
                          className="px-2 py-1.5 w-full text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:px-3 sm:py-2"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-700 sm:text-sm">
                          Reps
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => updateExerciseDetails(activeDay, index, 'reps', parseInt(e.target.value) || 1)}
                          className="px-2 py-1.5 w-full text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:px-3 sm:py-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={savePlan}
              disabled={isSaving}
              className="flex items-center px-4 py-2 text-sm text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600 disabled:bg-blue-300 sm:px-6 sm:py-3 sm:text-base"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="mr-1.5 w-4 h-4 sm:mr-2 sm:w-5 sm:h-5" />
                  Save Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Selection Modal */}
      {isExerciseModalOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-2 bg-black bg-opacity-50 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">Add Exercises</h2>
                <button
                  onClick={() => setIsExerciseModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:gap-4 sm:mb-6">
                <div className="relative flex-grow">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    type="text"
                    className="block py-2 pr-3 pl-9 w-full text-sm bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:py-3 sm:pl-10"
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex justify-between items-center px-3 py-2 w-full text-sm bg-white rounded-lg border border-gray-300 shadow-sm md:w-48 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 sm:py-3"
                  >
                    <div className="flex items-center">
                      <span>{selectedMuscle || 'Filter by muscle'}</span>
                    </div>
                    {isFilterOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
                    )}
                  </button>
                  
                  {isFilterOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-300 shadow-lg">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setSelectedMuscle('');
                            setIsFilterOpen(false);
                          }}
                          className="flex items-center px-3 py-2 w-full text-sm text-left rounded-md hover:bg-gray-100"
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
                            className="flex items-center px-3 py-2 w-full text-sm text-left rounded-md hover:bg-gray-100"
                          >
                            <span>{muscle.charAt(0).toUpperCase() + muscle.slice(1)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh] p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-3 rounded-lg border border-gray-200 transition-all cursor-pointer hover:border-blue-300 hover:shadow-md sm:p-4"
                    onClick={() => {
                      addExerciseToDay(exercise);
                      setIsExerciseModalOpen(false);
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <img
                        src={exercise.gif_url}
                        alt={exercise.name}
                        className="object-cover mr-2 w-10 h-10 rounded-md sm:mr-3 sm:w-12 sm:h-12"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 sm:text-base">{exercise.name}</h3>
                        <span className="text-xs text-gray-500 sm:text-sm">{exercise.muscle}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 sm:text-sm">{exercise.description1}</p>
                  </div>
                ))}
              </div>

              {filteredExercises.length === 0 && (
                <div className="py-8 text-center sm:py-12">
                  <p className="text-sm text-gray-500 sm:text-base">No exercises found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedMuscle('');
                    }}
                    className="px-3 py-1.5 mt-3 text-sm text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600 sm:px-4 sm:py-2 sm:mt-4"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end p-3 border-t border-gray-200 sm:p-4">
              <button
                onClick={() => setIsExerciseModalOpen(false)}
                className="px-3 py-1.5 text-sm text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 sm:px-4 sm:py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPlan;