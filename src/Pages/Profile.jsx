import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Camera, X, Check, Dumbbell, ChevronRight, Save, Eye, EyeOff, Clock, Flame, Target, Calendar, Plus, Upload } from 'lucide-react';
import NavBar from '../Components/NavBar';
import axios from 'axios';

const CustomPlanCard = ({ plan, onClick }) => {
  const getRandomColor = () => {
    const colors = [
      'bg-blue-600',
      'bg-indigo-600',
      'bg-purple-600',
      'bg-pink-600',
      'bg-red-600',
      'bg-orange-600',
      'bg-amber-600',
      'bg-green-600',
      'bg-teal-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const color = getRandomColor();

  return (
    <motion.div
      className="overflow-hidden relative bg-white rounded-2xl shadow-lg transition-shadow cursor-pointer group hover:shadow-xl"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
    >
      <div className={`overflow-hidden relative p-6 text-white ${color}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/20" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/20" />
        </div>
        
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-3 items-center">
              <div className="p-2 rounded-xl bg-white/20">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-white/20">
              {plan.days.length} {plan.days.length === 1 ? 'day' : 'days'}
            </span>
          </div>
          
          <div className="w-16 h-1 rounded-full bg-white/30" />
        </div>
      </div>
      
      <div className="p-6">
        {plan.description && (
          <p className="mb-4 text-sm text-gray-600">{plan.description}</p>
        )}
        
        <div className="mb-4 space-y-2">
          {plan.days.slice(0, 3).map((day, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-700">{day.name}</span>
              <span className="text-xs text-gray-500">({day.exercises.length} exercises)</span>
            </div>
          ))}
          {plan.days.length > 3 && (
            <div className="text-xs text-blue-500">
              +{plan.days.length - 3} more days
            </div>
          )}
        </div>
        
        <div className="flex justify-end items-center text-blue-600 transition-colors group-hover:text-blue-700">
          <span className="text-sm font-medium">View details</span>
          <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    age: '',
    gender: ''
  });
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState('');
  
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    // Load profile picture from localStorage if available
    const savedPicture = localStorage.getItem('profilePicture');
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
    
    const handleProfileUpdate = (e) => {
      setProfilePicture(e.detail.picture);
    };
    
    window.addEventListener('profilePictureUpdate', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profilePictureUpdate', handleProfileUpdate);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    currentPassword: '',
    newPassword: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const updatedFields = {
      name: formData.name
    };

    if (formData.email !== localStorage.getItem('userEmail')) {
      updatedFields.email = formData.email;
    }

    if (formData.currentPassword && formData.newPassword) {
      updatedFields.currentPassword = formData.currentPassword;
      updatedFields.newPassword = formData.newPassword;
    }

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedFields)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();

      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      
      setFormData(prev => ({
        ...prev,
        name: data.user.name,
        email: data.user.email,
        currentPassword: '',
        newPassword: ''
      }));
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'An error occurred while updating profile');
    }
  };

  useEffect(() => {
    document.title = `${formData.name}'s Profile`;
  }, [formData.name]);

  useEffect(() => {
    if (token) {
      fetchWorkoutPlans();
    }
  }, [token]);

  const fetchWorkoutPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await axios.get(`${API_URL}/api/workout-plans`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWorkoutPlans(response.data);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      setPlansError('Failed to load your workout plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Convert file to base64 for Cloudinary upload
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Image = reader.result;
        
        try {
          // Upload to Cloudinary using backend API
          const uploadResult = await axios.post(`${API_URL}/api/upload-image`, 
            { image: base64Image },
            { 
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          // Get the secure URL from the response
          const imageUrl = uploadResult.data.secure_url;
          
          // Update the UI and localStorage
          setProfilePicture(imageUrl);
          localStorage.setItem('profilePicture', imageUrl);
          
          // Notify other components about the profile picture update
          window.dispatchEvent(new CustomEvent('profilePictureUpdate', {
            detail: { picture: imageUrl }
          }));
        } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
        } finally {
          setUploading(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setUploading(false);
      };
    } catch (error) {
      console.error('Error handling file upload:', error);
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-white rounded-2xl shadow-lg lg:col-span-1"
          >
            <div className="relative mx-auto w-40 h-40">
              {profilePicture ? (
                // Display uploaded Cloudinary image
                <div className="overflow-hidden w-40 h-40 rounded-full shadow-lg">
                  <motion.img
                    className="object-cover w-full h-full"
                    src={profilePicture}
                    alt="Profile"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                </div>
              ) : (
                // Display default profile image placeholder
                <div className="flex justify-center items-center w-40 h-40 bg-gray-200 rounded-full shadow-lg">
                  <Camera className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="flex absolute right-2 bottom-2 space-x-2">
                <motion.button
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  whileHover={{ scale: 1.1 }}
                  onClick={triggerFileInput}
                  title="Upload your photo"
                >
                  <Camera className="w-5 h-5 text-gray-700" />
                </motion.button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6">
              {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="px-3 py-2 w-full rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="px-3 py-2 w-full rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                {isEditing && (
                  <>
                    <div className="relative">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="px-3 py-2 w-full rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-8"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="px-3 py-2 w-full rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-8"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4 justify-center mt-6">
                {isEditing ? (
                  <>
                    <motion.button
                      type="submit"
                      className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      className="flex gap-2 items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(prev => ({
                          ...prev,
                          currentPassword: '',
                          newPassword: ''
                        }));
                      }}
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      type="button"
                      className="flex gap-2 items-center px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                      whileHover={{ scale: 1.05 }}
                      onClick={handleLogOut}
                    >
                      <span>Logout</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      className="flex gap-2 items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setIsEditing(true)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </motion.button>
                  </>
                )}
              </div>
            </form>
          </motion.div>

          {/* Right Column - Custom Workout Plans */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-center mb-6"
            >
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">My Workout Plans</h2>
                <p className="text-gray-600">Your custom workout routines</p>
              </div>
              <Link
                to="/create-plan"
                className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <span>Create Plan</span>
              </Link>
            </motion.div>
            
            {loadingPlans ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
              </div>
            ) : plansError ? (
              <div className="p-4 text-red-700 bg-red-100 rounded-lg">
                {plansError}
              </div>
            ) : workoutPlans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-8 text-center bg-gray-50 rounded-xl border-2 border-gray-300 border-dashed"
              >
                <Calendar className="mx-auto mb-4 w-16 h-16 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">No Custom Plans Yet</h3>
                <p className="mx-auto mb-6 max-w-md text-gray-600">
                  Create your first custom workout plan to start tracking your fitness journey
                </p>
                <Link
                  to="/create-plan"
                  className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                >
                  <Plus className="mr-2 w-5 h-5" />
                  Create Your First Plan
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
                {workoutPlans.map(plan => (
                  <CustomPlanCard 
                    key={plan._id} 
                    plan={plan} 
                    onClick={() => navigate(`/workout/${plan._id}`)} 
                  />
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 mt-8 bg-blue-50 rounded-xl border border-blue-100"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Explore More Features</h3>
              <p className="mb-4 text-gray-600">
                Check out our new features to enhance your fitness journey
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/exercises"
                  className="flex gap-2 items-center px-4 py-2 text-blue-600 bg-white rounded-lg border border-blue-200 transition-colors hover:bg-blue-50"
                >
                  <Dumbbell className="w-4 h-4" />
                  <span>Exercise Library</span>
                </Link>
                <Link
                  to="/my-plans"
                  className="flex gap-2 items-center px-4 py-2 text-blue-600 bg-white rounded-lg border border-blue-200 transition-colors hover:bg-blue-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>All My Plans</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;