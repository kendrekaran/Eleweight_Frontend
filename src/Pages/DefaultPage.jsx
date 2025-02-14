import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Heart, Users, Target, Calendar, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const DefaultPage = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    { icon: <Activity className="w-6 h-6" />, title: "Workout Tracking", description: "Log and monitor your exercises with ease" },
    { icon: <Heart className="w-6 h-6" />, title: "Health Metrics", description: "Track vital statistics and progress" },
    { icon: <Users className="w-6 h-6" />, title: "Community", description: "Connect with fitness enthusiasts" },
    { icon: <Target className="w-6 h-6" />, title: "Goal Setting", description: "Set and achieve your fitness targets" },
    { icon: <Calendar className="w-6 h-6" />, title: "Smart Scheduling", description: "Plan your workouts efficiently" }
  ];

  const testimonials = [
    { name: "Karan K.", role: "Fitness Enthusiast", quote: "Eleweight has transformed my fitness journey. I love how easy it is to track my workouts and stay motivated!", rating: 5 },
    { name: "Sarah M.", role: "Personal Trainer", quote: "The best fitness tracking app I've ever used. My clients love the intuitive interface!", rating: 5 },
    { name: "John D.", role: "Gym Owner", quote: "Eleweight has helped my gym members stay consistent and achieve their goals faster.", rating: 4 },
    { name: "Emily R.", role: "Yoga Instructor", quote: "The app's scheduling feature is a game-changer for my yoga classes.", rating: 5 }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40" />
          <img
            src="/api/placeholder/1920/1080"
            alt="Fitness Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Welcome to Eleweight
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
            Your ultimate fitness companion for tracking workouts, managing nutrition, and achieving your fitness goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/login')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative px-8 py-3 bg-blue-500 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
            >
              Get Started
              <ArrowRight className={`inline-block ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Eleweight?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="relative">
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="p-8 bg-white rounded-xl shadow-lg mx-16">
              <p className="text-gray-600 italic mb-4">{testimonials[currentTestimonial].quote}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                    <p className="text-gray-500 text-sm">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-blue-500 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Start Your Fitness Journey?</h2>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-white text-blue-500 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-lg"
          >
            Join Eleweight Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;