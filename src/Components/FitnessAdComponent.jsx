import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const FitnessAdComponent = () => {
  return (
    <div className="overflow-x-hidden mx-auto mb-12 max-w-7xl rounded-2xl">
      <div className="flex flex-col w-full md:flex-row ">
        {/* Image Grid Section - Enhanced with overlays and better spacing */}
        <div className="flex relative  flex-col justify-center p-8 w-full md:w-1/2">
          <div className="absolute top-0 left-0 z-0 w-full h-full"></div>
          
          <div className="relative z-10">
            <h3 className="mb-3 text-xl font-semibold text-purple-800">FITNESS PROGRAM</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-3">
                <div className="relative overflow-hidden rounded-xl shadow-lg transform transition-transform hover:scale-[1.02] duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltJTIwZml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D" 
                    alt="Woman lifting weights" 
                    className="object-cover w-full h-72 rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t to-transparent from-purple-900/70"></div>
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative overflow-hidden rounded-xl shadow-lg h-40 transform transition-transform hover:scale-[1.02] duration-300">
                  <img 
                    src="https://i.pinimg.com/736x/2b/75/1e/2b751ebf7db5b183e8885237f47b6c03.jpg" 
                    alt="Man working out" 
                    className="object-cover w-full h-full rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t to-transparent from-purple-900/50"></div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="relative overflow-hidden rounded-xl shadow-lg h-40 transform transition-transform hover:scale-[1.02] duration-300">
                  <img 
                    src="https://i.pinimg.com/474x/04/3b/c1/043bc1ea703317016193ba982de3a70c.jpg" 
                    alt="Woman with barbell" 
                    className="object-cover w-full h-full rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t to-transparent from-purple-900/50"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex -space-x-2">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Member" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Member" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Member" className="w-10 h-10 rounded-full border-2 border-white" />
              </div>
              <p className="text-sm text-gray-600">Join <span className="font-bold">2,500+</span> members</p>
            </div>
          </div>
        </div>
        
        {/* Content Section - Enhanced with better typography and spacing */}
        <div className="flex relative flex-col justify-center p-10 w-full md:w-1/2">
          
          <div className="relative z-10">
            <h1 className="mb-6 text-5xl font-bold leading-tight text-black">
              Transform your <span className="text-black">physique</span> with our fitness plan
            </h1>
            
            <p className="mb-8 text-lg text-black">
              Join our community and achieve your fitness goals with personalized workout plans and expert guidance.
            </p>
            
            <div className="mb-10 space-y-5">
              <div className="flex items-center group">
                <div className="flex justify-center items-center mr-4 w-8 h-8 rounded-full transition-colors bg-blue-500/20 group-hover:bg-blue-500/30">
                  <CheckCircle className="text-blue-300" size={18} />
                </div>
                <p className="text-lg text-black">Increase Muscle and Strength</p>
              </div>
              <div className="flex items-center group">
                <div className="flex justify-center items-center mr-4 w-8 h-8 rounded-full transition-colors bg-blue-500/20 group-hover:bg-blue-500/30">
                  <CheckCircle className="text-blue-300" size={18} />
                </div>
                <p className="text-lg text-black">Be Healthier than before</p>
              </div>
              <div className="flex items-center group">
                <div className="flex justify-center items-center mr-4 w-8 h-8 rounded-full transition-colors bg-blue-500/20 group-hover:bg-blue-500/30">
                  <CheckCircle className="text-blue-300" size={18} />
                </div>
                <p className="text-lg text-black">Increase Stamina</p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button className="flex justify-center items-center px-8 py-4 font-bold text-white bg-purple-500 rounded-xl shadow-lg transition-all group hover:bg-purple-600 hover:shadow-blue-500/30">
                Join now
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessAdComponent;