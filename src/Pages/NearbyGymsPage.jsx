import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import NearbyGyms from '../Components/NearbyGyms';
import { MapPin } from 'lucide-react';

const NearbyGymsPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      
      {/* Hero Section */}
      <section className="px-4 py-16 text-white bg-gradient-to-b from-purple-500 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block p-3 mb-6 bg-purple-400 bg-opacity-30 rounded-full">
            <MapPin className="w-8 h-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Find Gyms Near You</h1>
          <p className="mx-auto max-w-2xl text-xl opacity-90">
            Discover fitness centers in your area to kickstart your fitness journey. 
            We'll help you find the perfect gym based on your location.
          </p>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12">
        <NearbyGyms />
      </section>
      
      {/* FAQ Section */}
      <section className="px-4 py-16 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-12 text-3xl font-bold text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            {[
              {
                question: "How does the gym finder work?",
                answer: "Our gym finder uses your current location (with your permission) to search for fitness centers near you. We display information like ratings, opening hours, and directions to help you choose the right gym."
              },
              {
                question: "Why do I need to enable location services?",
                answer: "Location services help us find gyms that are closest to your current position. This ensures you get the most relevant results. If you prefer not to share your location, we'll use a default location instead."
              },
              {
                question: "Can I adjust the search radius?",
                answer: "Yes! You can use the slider to adjust how far you want to search for gyms, from 500 meters up to 5 kilometers."
              },
              {
                question: "Are the gym ratings accurate?",
                answer: "The ratings shown are based on user reviews from Google Maps. They reflect the experiences of people who have visited these gyms."
              }
            ].map((faq, index) => (
              <div key={index} className="pb-6 border-b border-gray-200">
                <h3 className="mb-3 text-xl font-semibold">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NearbyGymsPage; 