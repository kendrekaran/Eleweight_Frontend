import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../Components/NavBar';
import { exercises } from '../exercises.json';
import { Calendar, Users, Dumbbell, Timer, ChevronRight, Target, Trophy } from 'lucide-react';

const Plans = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
    useEffect(() => {
      if (!token) {
        navigate("/login");
      }
    }, [token, Navigate]);
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);


  const planDetails = {
    classic: {
      image:"https://i.pinimg.com/474x/53/ec/b5/53ecb5dae265e12b423ed8cdbdb1de03.jpg",
      title: 'Classic Body Part Split',
      days: '5 Days per Week',
      description: 'Traditional bodybuilding split targeting each muscle group once per week',
      intensity: 'High',
      experience: 'Intermediate'
    },
    ppl: {
      image:'https://i.pinimg.com/474x/81/3a/a7/813aa7255685f11be23fd13de9ac84b2.jpg',
      title: 'Push, Pull, Legs',
      days: '6 Days per Week',
      description: 'Efficient split for maximum muscle growth and strength gains',
      intensity: 'High',
      experience: 'Advanced'
    },
    'upper-lower': {
      image:'https://i.pinimg.com/474x/45/40/c1/4540c1ae44d7ec684bac54292b99bdc5.jpg',
      title: 'Upper/Lower Split',
      days: '4 Days per Week',
      description: 'Balanced approach for building strength and muscle mass',
      intensity: 'Moderate',
      experience: 'Intermediate'
    },
    fullbody: {
      image:'https://i.pinimg.com/474x/d0/ca/72/d0ca72fac05f6b51c4e888ba0c154381.jpg',
      title: 'Full-Body Routine',
      days: '3 Days per Week',
      description: 'Perfect for beginners and those with limited time for exercise, this routine offers a simple yet effective way to stay active.',
      intensity: 'Moderate',
      experience: 'Beginner'
    },
    power: {
      image:'https://i.pinimg.com/736x/b2/15/63/b21563f95b6b34fce85bc843699038f5.jpg',
      title: 'Power & Hypertrophy Split',
      days: '5 Days per Week',
      description: 'Focus on building strength and increasing muscle size through a well-structured workout plan that incorporates progressive overload.',
      intensity: 'Very High',
      experience: 'Advanced'
    },
    endurance: {
      image:'https://i.pinimg.com/474x/cb/5d/ee/cb5deee7a729b262409de28df8392fa4.jpg',
      title: 'Endurance Training',
      days: '4 Days per Week',
      description: 'Improve stamina and functional fitness along with muscle tone and endurance. This plan is perfect for those looking to increase cardiovascular health.',
      intensity: 'Moderate',
      experience: 'All Levels'
    }
  };

  const handlePlanSelection = (plan) => {
    let selectedExercises = [];
  
    switch (plan) {
      case 'classic':
        selectedExercises = {
          day1: [...exercises.chest.slice(0, 4), ...exercises.arms.slice(5, 9)], // Chest & arms
          day2: [...exercises.back.slice(0, 4), ...exercises.arms.slice(0, 3)],  // Back & arms
          day3: [...exercises.legs.slice(0, 6)],                                  // Legs
          day4: [...exercises.shoulders.slice(0, 4), ...exercises.core.slice(0, 3)], // Shoulders & Core
          day5: [...exercises.arms.slice(0, 4), ...exercises.core.slice(0, 3)]    // Arms & Core
        };
        break;
  
      case 'ppl':
        selectedExercises = {
          day1: [...exercises.chest.slice(0, 4), ...exercises.shoulders.slice(0, 3)], // Push
          day2: [...exercises.back.slice(0, 4), ...exercises.arms.slice(0, 3)],  // Pull
          day3: [...exercises.legs.slice(0, 6)],                                  // Legs
          day4: [...exercises.chest.slice(0, 4), ...exercises.shoulders.slice(0, 3)], // Push
          day5: [...exercises.back.slice(0, 4), ...exercises.arms.slice(0, 3)],  // Pull
          day6: [...exercises.legs.slice(0, 6)],                                  // Legs
        };
        break;
  
      case 'upper-lower':
        selectedExercises = {
          day1: [...exercises.chest.slice(0, 3), ...exercises.back.slice(0, 3), ...exercises.shoulders.slice(0, 3)], 
          day2: [...exercises.legs.slice(0, 6)],
          day3: [...exercises.chest.slice(0, 3), ...exercises.back.slice(0, 3), ...exercises.shoulders.slice(0, 3)], 
          day4: [...exercises.legs.slice(0, 6)]
        };
        break;
  
      case 'fullbody':
        selectedExercises = {
          day1: [...exercises.chest.slice(0, 2), ...exercises.back.slice(0, 2), ...exercises.legs.slice(0, 2), ...exercises.shoulders.slice(0, 2), ...exercises.arms.slice(0, 2)],
          day2: [...exercises.chest.slice(0, 2), ...exercises.back.slice(0, 2), ...exercises.legs.slice(0, 2), ...exercises.shoulders.slice(0, 2), ...exercises.core.slice(0, 2)],
          day3: [...exercises.chest.slice(0, 2), ...exercises.back.slice(0, 2), ...exercises.legs.slice(0, 2), ...exercises.shoulders.slice(0, 2), ...exercises.arms.slice(0, 2)]
        };
        break;
  
      case 'power':
        selectedExercises = {
          day1: [...exercises.chest.slice(0, 3), ...exercises.arms.slice(0, 3)], 
          day2: [...exercises.back.slice(0, 3), ...exercises.arms.slice(0, 3)],  
          day3: [...exercises.legs.slice(0, 6)],                                  
          day4: [...exercises.shoulders.slice(0, 3), ...exercises.core.slice(0, 3)], 
          day5: [...exercises.arms.slice(0, 4), ...exercises.core.slice(0, 3)]   
        };
        break;
  
      case 'endurance':
        selectedExercises = {
          day1: [...exercises.chest.slice(0, 2), ...exercises.back.slice(0, 2), ...exercises.core.slice(0, 2)], 
          day2: [...exercises.legs.slice(0, 4), ...exercises.core.slice(0, 2)],   
          day3: [...exercises.shoulders.slice(0, 2), ...exercises.arms.slice(0, 2), ...exercises.core.slice(0, 2)], 
          day4: [...exercises.chest.slice(0, 2), ...exercises.back.slice(0, 2), ...exercises.core.slice(0, 2)]
        };
        break;
  
      default:
        selectedExercises = {};
    }


    navigate(`/plans/${plan}`, { state: { exercises: selectedExercises } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center sm:mb-12"
        >
          <h1 className="px-2 mb-3 text-3xl font-bold sm:text-4xl md:text-5xl sm:mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
              Choose Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-sky-600 to-purple-600">
                {" "}
                Training Plan
              </span>
            </span>
          </h1>
          <p className="px-4 mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
            Select a workout plan that matches your goals and experience level
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6 lg:gap-8">
          {Object.keys(planDetails).map((plan, index) => (
            <motion.div
              key={plan}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handlePlanSelection(plan)}
              className="overflow-hidden relative bg-white rounded-2xl shadow-md transition-all duration-300 cursor-pointer group hover:shadow-xl"
            >
              <div className="relative aspect-w-16 aspect-h-9">
                <img
                  className="object-cover inset-0 w-full h-48 transition-transform duration-300 sm:h-64 group-hover:scale-105"
                  src={planDetails[plan].image}
                  alt={planDetails[plan].title}
                />
                <div className="absolute inset-0 bottom-0 bg-gradient-to-t to-transparent from-black/80 via-black/50" />
              </div>

              <div className="relative p-4 sm:p-6">
                <h3 className="mb-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 sm:text-2xl">
                  {planDetails[plan].title}
                </h3>

                <p className="mb-4 text-xs text-gray-600 sm:text-sm">
                  {planDetails[plan].description}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex gap-1 items-center sm:gap-2">
                    <Calendar className="w-4 h-4 text-purple-500 sm:w-5 sm:h-5" />
                    <span className="text-xs text-gray-600 sm:text-sm">{planDetails[plan].days}</span>
                  </div>
                  <div className="flex gap-1 items-center sm:gap-2">
                    <Timer className="w-4 h-4 text-purple-500 sm:w-5 sm:h-5" />
                    <span className="text-xs text-gray-600 sm:text-sm">{planDetails[plan].intensity}</span>
                  </div>
                  <div className="flex gap-1 items-center sm:gap-2">
                    <Users className="w-4 h-4 text-purple-500 sm:w-5 sm:h-5" />
                    <span className="text-xs text-gray-600 sm:text-sm">{planDetails[plan].experience}</span>
                  </div>
                  <div className="flex gap-1 items-center sm:gap-2">
                    <Dumbbell className="w-4 h-4 text-purple-500 sm:w-5 sm:h-5" />
                    <span className="text-xs text-gray-600 sm:text-sm">Strength Focus</span>
                  </div>
                </div>

                <div className="absolute right-0 bottom-0 left-0 h-1 bg-purple-500 transition-transform duration-300 transform origin-left scale-x-0 group-hover:scale-x-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;