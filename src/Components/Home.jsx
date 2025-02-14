import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import FeatureCards from './FeaturedCards';
import { motion } from "framer-motion";
import { Dumbbell, List, Utensils, Bot, MoveRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const FeatureCard = ({ image, Icon, title, description, link }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative w-full max-w-5xl mx-auto border bg-white  rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      >
        <div className="absolute inset-0  bg-gradient-to-br from-sky-100 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex flex-col md:ml-24  md:flex-row items-center justify-center gap- sm:gap-24 p-4 sm:p-6 lg:p-8">
          {/* Image Container */}
          <div className="w-full md:w-1/3 lg:w-72">
            <div className="aspect-square relative rounded-2xl overflow-hidden ">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-100/20 to-gray-100/20 group-hover:scale-110 transition-transform duration-300" />
              <img
                src={image}
                className="h-full w-full object-cover rounded-3xl object-center p-4 group-hover:scale-105 transition-transform duration-300"
                alt={title}
              />
            </div>
          </div>
  
          {/* Content Container */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-sky-50 rounded-2xl group-hover:bg-sky-100 transition-colors duration-300">
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
            </div>
  
            <p className="text-sm sm:text-base sm:pr-44 text-gray-600 leading-relaxed">
              {description}
            </p>
  
            <Link
              to={link}
              className="inline-flex items-center  justify-between w-full sm:w-80 px-4 sm:px-6 py-3 bg-sky-600 text-white text-sm sm:text-base rounded-xl hover:bg-sky-700 transition-colors duration-200 group/button"
            >
              <span>Get Started</span>
              <MoveRight className="ml-2 w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden ">
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-sky-200/20 to-sky-200/20 rounded-full blur-3xl" />

          <div className="relative z-10 container mx-auto sm:my-32 lg:my-0 px-6 sm:px-16 lg:px-32 h-full md:h-[90vh] flex items-center">
            <div className="px-8 py-8 flex flex-col  lg:flex-row-reverse justify-center gap-4 sm:gap-12 items-center w-full ">
              <motion.div
                className="relative w-full lg:w-1/2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="absolute inset-0  bg-gradient-to-br from-blue-400/20 to-blue-400/20 rounded-[2rem] blur-3xl" />
                <img
                  src="Toji.svg"
                  alt="Fitness"
                  className="relative w-60 md:w-full max-w-xl pt-4 md:pt-0 mx-auto object-contain drop-shadow-2xl"
                />
              </motion.div>


              <motion.div
                className="space-y-8 w-full lg:w-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="space-y-2 sm:space-y-8">
                  <motion.div
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-600 border border-gray-100 shadow-sm "
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Dumbbell className="sm:w-4 sm:h-4" />
                    <span className='text-xs'>Your Fitness Journey Starts Here</span>
                  </motion.div>

                  <h1 className="text-3xl sm:text-5xl md:text-7xl text-center sm:text-start font-bold leading-tight">
                    <span className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                      Your 
                      <span className="bg-gradient-to-br from-blue-600 to-sky-600 bg-clip-text text-transparent">
                      {" "}
                      Personal
                    </span>
                      <br />
                      Guide To
                    </span>
                    <span className="bg-gradient-to-br from-blue-600 to-sky-600 bg-clip-text text-transparent">
                      {" "}
                      Fitness
                    </span>
                  </h1>

                  <p className="text-xs text-center sm:text-start sm:text-base text-gray-600 max-w-xl leading-tight ">
                  Explore customized exercises for your fitness level. Track progress, stay motivated, and build a stronger, healthier you.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 px-8 sm:px-0">
                  <Link
                    to="/muscle"
                    className="group inline-flex items-center justify-center gap-2 px-2 py-2 sm:px-6 sm:py-3 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-2xl font-semibold hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    Start Training
                    <MoveRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    to="/diet"
                    className="group inline-flex items-center justify-center gap-2 px-2 py-2 sm:px-6 sm:py-3 bg-white border border-gray-200 text-gray-900 rounded-2xl font-semibold hover:border-gray-300 hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    Generate Diet
                    <Bot className="group-hover:rotate-12 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>




          {/* Features Section */}
          <section className="py-24 px-6 min-h-screen flex flex-col items-center justify-center gap-16 sm:px-16 lg:px-32 bg-gradient-to-br from-white to-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Explore Our
              </span>
              <span className="bg-gradient-to-br from-sky-600 to-sky-500 bg-clip-text text-transparent">
                {" "}Features
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover powerful tools and resources designed to help you achieve your fitness goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 w-full">
            <FeatureCard
              image="https://i.pinimg.com/736x/55/21/9c/55219c8309c5ed369d81a4f7e30cdb84.jpg"
              Icon={Dumbbell}
              title="Browse Exercises"
              description="Discover exercises tailored to all fitness levels and muscle groups. Perfect for beginners to pros. Our extensive library ensures you'll find the right exercises for your goals."
              link="/muscle"
            />
            <FeatureCard
              image="https://i.pinimg.com/474x/4c/e1/b1/4ce1b1f605f3b2aedfdd5aa8ab083b63.jpg"
              Icon={List}
              title="Workout Plans"
              description="Choose from expertly designed workout plans to achieve your fitness goals. Whether you're building strength or improving endurance, we have the perfect plan for you."
              link="/plans"
            />
            <FeatureCard
              image="https://i.pinimg.com/736x/aa/d3/4e/aad34e88c7cebbbfbbeb82b614d8eee1.jpg"
              Icon={Utensils}
              title="Diet Plans"
              description="Get personalized diet plans that complement your workout routine. Our nutrition guidance helps you fuel your body properly and achieve optimal results."
              link="/diet"
            />
          </div>
        </section>

      {/* Results Section */}
      <section className="py-24 px-6 sm:px-16 lg:px-32 bg-sky-200">
        <motion.div 
          className="text-center mb-16"
          {...fadeInUp}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Train Hard. Track Results.
            <br />
            Transform Your Fitness Journey.
          </h2>
        </motion.div>
        <FeatureCards />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6 sm:px-16 lg:px-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <i className="fi fi-ss-gym text-white" />
                <h1 className="font-bold text-3xl">Eleweight</h1>
              </div>
              <p className="text-gray-400">Created by Karan Kendre</p>
            </div>
            
            {['Socials', 'Support', 'Company'].map((title) => (
              <div key={title}>
                <h2 className="font-bold text-lg mb-4">{title}</h2>
                <ul className="space-y-2">
                  {['Instagram', 'LinkedIn', 'Twitter'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            © 2024 Eleweight. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;