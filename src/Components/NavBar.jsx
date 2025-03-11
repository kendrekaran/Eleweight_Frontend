import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, X, Menu, User, Search, Bell, ChevronDown, LogOut, Settings, Camera, Upload, Check, UserCircle } from 'lucide-react';
import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dfm5hoz41';
const CLOUDINARY_API_KEY = '258339917617439';
const CLOUDINARY_UPLOAD_PRESET = 'dfm5hoz41';

const NavBar = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState('https://i.pinimg.com/474x/a3/cc/fd/a3ccfd7885e6cff94ebbbe40fd9e1611.jpg');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || 'user@example.com');
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedPicture = localStorage.getItem('profilePicture');
      if (savedPicture) {
        setProfileImage(savedPicture);
      }
      setUserName(localStorage.getItem('userName') || 'User');
      setUserEmail(localStorage.getItem('userEmail') || 'user@example.com');
    };

    const handleProfileUpdate = (e) => {
      setProfileImage(e.detail.picture);
    };

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    handleStorageChange();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profilePictureUpdate', handleProfileUpdate);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profilePictureUpdate', handleProfileUpdate);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate("/login");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Create a FormData object for the file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
      formData.append('api_key', CLOUDINARY_API_KEY);
      
      // Upload to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      
      // Get the optimized image URL with auto-format and auto-quality
      const imageUrl = response.data.secure_url;
      
      // Update the UI and localStorage
      setProfileImage(imageUrl);
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

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Enhanced navigation links with icons
  const navLinks = [
    { path: "/home", name: "Home", icon: "home" },
    { path: "/exercises", name: "Exercises", icon: "dumbbell" },
    { path: "/my-plans", name: "My Plans", icon: "calendar" },
    { path: "/diet", name: "Diet Plans", icon: "utensils" },
    { path: "/nearby-gyms", name: "Find Gyms", icon: "map-pin", isNew: true },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:px-8 lg:px-32 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo with enhanced animation */}
        <Link to="/home" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg shadow-md group-hover:shadow-lg"
          >
            <Dumbbell className="w-5 h-5 text-white" />
          </motion.div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-300 transition-all">
            Eleweight
          </h1>
        </Link>
        
        {/* Desktop Navigation with improved hover effects */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `relative text-base font-medium px-3 py-2 rounded-md transition-all flex items-center gap-1.5
                  ${isActive 
                    ? 'text-blue-600 bg-blue-50/80 backdrop-blur-sm' 
                    : scrolled 
                      ? 'text-gray-700 hover:text-blue-500 hover:bg-gray-50/80' 
                      : 'text-gray-800 hover:text-blue-500 hover:bg-white/30 backdrop-blur-sm'}`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-1.5">
                    {link.name}
                    {link.isNew && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                        NEW
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Search Button */}
          <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-gray-50/80 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-gray-50/80 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Enhanced Profile Section with Dropdown */}
          <div className="pl-4 border-l border-gray-200 relative" ref={dropdownRef}>
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="group flex items-center gap-2 p-1 rounded-full hover:bg-gray-50/80 transition-colors"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm group-hover:shadow-md transition-all"
                  src={profileImage}
                  alt="Profile"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 hidden md:block">
                {userName}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 hidden md:block transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative group">
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <button 
                          onClick={triggerFileInput}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {uploading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Camera className="w-5 h-5 text-white" />
                          )}
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileUpload} 
                          className="hidden" 
                          accept="image/*"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{userName}</h3>
                        <p className="text-sm text-gray-500">{userEmail}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-2">
                      <button 
                        onClick={handleLogOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Improved Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden p-2 rounded-lg bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </motion.div>
        </button>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl sm:hidden mx-2 rounded-xl border border-gray-100 overflow-hidden z-50"
            >
              <div className="flex flex-col p-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => 
                      `px-4 py-3 my-1 rounded-lg text-base font-medium transition-all flex items-center justify-between
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                    }
                  >
                    <span className="flex items-center gap-2">
                      {link.name}
                      {link.isNew && (
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                          NEW
                        </span>
                      )}
                    </span>
                  </NavLink>
                ))}

                {/* Profile section in mobile menu */}
                <div className="border-t border-gray-100 mt-2 pt-3">
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative group">
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <button 
                          onClick={triggerFileInput}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {uploading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Camera className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{userName}</h3>
                        <p className="text-xs text-gray-500">{userEmail}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        handleLogOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;