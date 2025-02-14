import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Camera, X, Check, Dumbbell, ChevronRight, Save, Eye, EyeOff, Clock, Flame, Target } from 'lucide-react';
import NavBar from '../Components/NavBar';


const avatarImages = [
  'https://i.pinimg.com/474x/a3/cc/fd/a3ccfd7885e6cff94ebbbe40fd9e1611.jpg',
  'https://i.pinimg.com/474x/9f/df/46/9fdf46c6e5b2465e340ede0da9ee431b.jpg',
  'https://i.pinimg.com/474x/aa/4b/e1/aa4be101f8877e149fec292df48386c6.jpg',
  'https://i.pinimg.com/474x/7b/1d/a5/7b1da57b92ec01450be38816f4a01da1.jpg',
  'https://i.pinimg.com/736x/ee/09/21/ee09218c417823a7c7dbb67c5d3efd1b.jpg',
  'https://i.pinimg.com/736x/5e/77/8e/5e778ebab678d1a829f5562f8a977bc4.jpg',
  'https://i.pinimg.com/474x/9e/ec/be/9eecbe985bc4caaab201a0859c80e4c5.jpg',
  'https://i.pinimg.com/474x/be/36/67/be366773fcf2247e40fe6f22ab509cf0.jpg',
  'https://i.pinimg.com/474x/cc/ef/e1/ccefe13166d611943acdaca183e2663c.jpg'
  ];

const ProfilePictureModal = ({ isOpen, onClose, onSelect, currentImage }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-xl p-6 max-w-lg w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Choose Profile Picture</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {avatarImages.map((avatar, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(avatar)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 
                  ${currentImage === avatar ? 'border-blue-500' : 'border-transparent'}`}
              >
                <img
                  src={avatar}
                  alt={`Avatar option ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {currentImage === avatar && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="bg-white rounded-full p-1">
                      <Check className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const TrainingSplitCard = ({ title, exercises, color, link }) => {
  const getIcon = () => {
    switch (title.toLowerCase()) {
      case 'push day':
        return <Dumbbell className="w-6 h-6" />;
      case 'pull day':
        return <Target className="w-6 h-6" />;
      case 'leg day':
        return <Flame className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={`relative p-6 ${color} text-white overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full" />
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                {getIcon()}
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <span className="px-3 py-1 text-sm bg-white/20 rounded-full font-medium">
              {exercises.length} exercises
            </span>
          </div>
          
          <div className="h-1 w-16 bg-white/30 rounded-full" />
        </div>
      </div>

      <div className="p-6">
        <ul className="space-y-3">
          {exercises.slice(0, 3).map((exercise, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 text-gray-600 group-hover:text-gray-900"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
              <span className="text-sm font-medium">{exercise}</span>
            </motion.li>
          ))}
        </ul>

        {exercises.length > 3 && (
          <Link to={link}>
            <motion.div
              className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-blue-600 cursor-pointer group/link"
              whileHover={{ x: 4 }}
            >
              <span className="font-semibold ">
                +{exercises.length - 3} more exercises
              </span>
              <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        )}
      </div>
    </motion.div>
  );
};


const Profile = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(avatarImages[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  
    useEffect(() => {
      if (!token) {
        navigate("/login");
      }
    }, [token, Navigate]);
  

  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    currentPassword: '',
    newPassword: ''
  });


  const trainingSplits = [
    {
      title: "Chest Day",
      link : "/muscle/chest",
      exercises: [
        "Bench Press",
        "Incline Dumbbell Press",
        "Decline Benchpress",
        "Pec Dec Machine",
        "Chest Flyes"
      ],
      color: "bg-blue-600"
    },
    {
      title: "Arms Day",
      link : "/muscle/arms",
      exercises: [
        "Hammer Curl",
        "Preacher Curl",
        "Bicep Curls",
        "Pull-ups",
        "Face Pulls"
      ],
      color: "bg-blue-600"
    },
    {
      title: "Leg Day",
      link : "/muscle/legs",
      exercises: [
        "Squats",
        "Romanian Deadlifts",
        "Leg Press",
        "Calf Raises",
        "Leg Extensions"
      ],
      color: "bg-blue-600"
    },
    {
      title: "Core & Cardio",
      link : "/muscle/core",
      exercises: [
        "Planks",
        "Leg Raise",
        "Russian Twist",
        "HIIT Intervals",
        "Jump Rope"
      ],
      color: "bg-blue-600"
    }
  ];

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

  const handlePictureSelect = (newPicture) => {
    setProfilePicture(newPicture);
    localStorage.setItem('profilePicture', newPicture);
    window.dispatchEvent(new CustomEvent('profilePictureUpdate', {
      detail: { picture: newPicture }
    }));
    setIsModalOpen(false);
  };

  const API_BASE_URL = 'http://localhost:3000'; // Add this line

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
      const response = await fetch(`${API_BASE_URL}/profile`, {
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
  } 
  

  useEffect(() => {
    document.title = `${formData.name}'s Profile`;
    const savedPicture = localStorage.getItem('profilePicture');
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  }, [formData.name]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handlePictureSelect}
        currentImage={profilePicture}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="relative mx-auto w-40 h-40">
                <motion.img
                  className="w-40 h-40 rounded-full object-cover shadow-lg"
                  src={profilePicture}
                  alt="Profile"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
                <motion.button
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <Camera className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  {isEditing && (
                    <>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                <div className="mt-6 flex justify-center gap-4">
                  {isEditing ? (
                    <>
                      <motion.button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                        whileHover={{ scale: 1.05 }}
                        onClick={handleLogOut}
                      >
                        <span>Logout</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
            </div>
          </motion.div>

          {/* Right Column - Training Splits */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Training Splits</h2>
              <p className="text-gray-600">Customize your workout routine with these training splits</p>
            </motion.div>
            
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {trainingSplits.map((split, index) => (
                <TrainingSplitCard
                  key={index}
                  title={split.title}
                  exercises={split.exercises}
                  color={split.color}
                  link={split.link}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;