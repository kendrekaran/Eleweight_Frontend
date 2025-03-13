import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ArrowRight } from 'lucide-react';
import axios from 'axios';
import NavBar from '../Components/NavBar';

const FoodAnalysis = () => {
  const [imageBase64, setImageBase64] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [foodAnalysisResults, setFoodAnalysisResults] = useState(null);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const gradientText = "bg-gradient-to-r from-purple-500 via-purple-500 to-sky-500 bg-clip-text text-transparent";
  
  // Start camera stream
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions or try uploading an image instead.");
    }
  };
  
  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };
  
  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to base64
      const base64Data = canvas.toDataURL('image/jpeg').split(",")[1];
      setImageBase64(base64Data);
      
      // Stop camera after capturing
      stopCamera();
    }
  };
  
  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Remove the "data:image/jpeg;base64," part
      const base64Data = reader.result.split(",")[1];
      setImageBase64(base64Data);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Analyze food using Google Gemini API
  const analyzeFood = async () => {
    if (!imageBase64) {
      setError('Please capture or upload an image first');
      return;
    }

    setIsAnalyzingImage(true);
    setFoodAnalysisResults(null);
    setError('');

    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

    const requestData = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
              }
            },
            {
              text: "Identify the food in this image and provide the estimated macronutrients (calories, protein, carbs, fats). Format the response as JSON with fields: foodName, calories, protein, carbs, fats."
            }
          ]
        }
      ]
    };

    try {
      const response = await axios.post(API_URL, requestData, {
        headers: { "Content-Type": "application/json" }
      });
      
      // Extract the text response from Gemini
      const responseText = response.data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON from the response
      try {
        // Find JSON in the response text (it might be surrounded by markdown code blocks)
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                          responseText.match(/```\n([\s\S]*?)\n```/) || 
                          responseText.match(/{[\s\S]*?}/);
        
        let parsedData;
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          // If no JSON format is found, create a simple object from the text
          parsedData = {
            analysis: responseText,
            foodName: "Unknown",
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0
          };
        }
        
        setFoodAnalysisResults(parsedData);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        setFoodAnalysisResults({
          analysis: responseText,
          foodName: "Unknown",
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        });
      }
    } catch (error) {
      console.error("Error analyzing food:", error);
      setError('Error analyzing food image. Please try again.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar/>
      <div className="p-4 mx-auto max-w-6xl md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className={`mb-2 text-3xl font-bold md:text-4xl ${gradientText}`}>
            Food Analysis with AI
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            Take a picture of your food or upload an image to get instant nutritional information
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 mx-auto mb-8 rounded-xl border shadow-xl backdrop-blur-sm bg-white/90 border-white/50"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              {/* Camera View */}
              <AnimatePresence>
                {showCamera ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative"
                  >
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="object-cover w-full h-64 bg-black rounded-xl border border-gray-200"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    <div className="flex justify-center mt-4 space-x-4">
                      <motion.button
                        onClick={captureImage}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex gap-2 items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                      >
                        <span>Capture</span>
                        <Camera className="w-5 h-5" />
                      </motion.button>
                      
                      <motion.button
                        onClick={stopCamera}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex gap-2 items-center px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                      >
                        <span>Cancel</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {imageBase64 ? (
                      <div className="relative">
                        <img 
                          src={`data:image/jpeg;base64,${imageBase64}`} 
                          alt="Food" 
                          className="object-cover w-full h-64 rounded-xl border border-gray-200"
                        />
                        <div className="flex absolute inset-0 justify-center items-center">
                          <motion.button
                            onClick={() => setImageBase64('')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-md opacity-80 hover:opacity-100"
                          >
                            Change Image
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <motion.button
                          onClick={startCamera}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex gap-3 items-center p-6 text-left text-gray-700 bg-gray-50 rounded-xl border-2 border-gray-300 border-dashed transition-colors hover:border-purple-300 hover:bg-purple-50/50"
                        >
                          <div className="p-3 bg-purple-100 rounded-full">
                            <Camera className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">Take a Photo</h3>
                            <p className="text-sm text-gray-500">Use your camera to capture food</p>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          onClick={triggerFileInput}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex gap-3 items-center p-6 text-left text-gray-700 bg-gray-50 rounded-xl border-2 border-gray-300 border-dashed transition-colors hover:border-purple-300 hover:bg-purple-50/50"
                        >
                          <div className="p-3 bg-blue-100 rounded-full">
                            <Upload className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">Upload Image</h3>
                            <p className="text-sm text-gray-500">Select a photo from your device</p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </motion.button>
                      </div>
                    )}
                    
                    {imageBase64 && (
                      <motion.button
                        onClick={analyzeFood}
                        disabled={isAnalyzingImage}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex gap-2 items-center px-6 py-3 w-full font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                      >
                        {isAnalyzingImage ? (
                          <>
                            <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <span>Analyze Food</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {error && (
                <p className="p-3 text-red-500 bg-red-50 rounded-lg">{error}</p>
              )}
            </div>
            
            <AnimatePresence>
              {foodAnalysisResults && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-4 rounded-xl shadow-lg bg-white/80"
                >
                  <h3 className="text-xl font-semibold text-purple-700">
                    {foodAnalysisResults.foodName || "Food Analysis"}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 text-center bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-500">Calories</p>
                      <p className="text-xl font-bold">{foodAnalysisResults.calories || 0} kcal</p>
                    </div>
                    <div className="p-3 text-center bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-500">Protein</p>
                      <p className="text-xl font-bold">{foodAnalysisResults.protein || 0} g</p>
                    </div>
                    <div className="p-3 text-center bg-amber-50 rounded-lg">
                      <p className="text-sm text-amber-500">Carbs</p>
                      <p className="text-xl font-bold">{foodAnalysisResults.carbs || 0} g</p>
                    </div>
                    <div className="p-3 text-center bg-green-50 rounded-lg">
                      <p className="text-sm text-green-500">Fats</p>
                      <p className="text-xl font-bold">{foodAnalysisResults.fats || 0} g</p>
                    </div>
                  </div>
                  
                  {foodAnalysisResults.analysis && (
                    <div className="p-4 mt-3 text-gray-700 bg-gray-50 rounded-lg">
                      <p>{foodAnalysisResults.analysis}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodAnalysis; 