import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, X, Menu, User, Search, Bell, ChevronDown, LogOut, Settings, Camera, Upload, Check, UserCircle, ScanLine } from 'lucide-react';

const NavBar = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState('https://i.pinimg.com/474x/a3/cc/fd/a3ccfd7885e6cff94ebbbe40fd9e1611.jpg');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
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
      // Create a local URL for the file for preview
      const imageUrl = URL.createObjectURL(file);
      
      // Update the UI and localStorage
      setProfileImage(imageUrl);
      localStorage.setItem('profilePicture', imageUrl);
      
      // Notify other components about the profile picture update
      window.dispatchEvent(new CustomEvent('profilePictureUpdate', {
        detail: { picture: imageUrl }
      }));
    } catch (error) {
      console.error('Error handling image:', error);
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
    { path: "/nearby-gyms", name: "Find Gyms", icon: "map-pin" },
  ];

  return (
    <nav className={`top-0 left-0 right-0 z-50 py-2 px-4 sm:px-8 lg:px-32 mx-4 my-4 transition-all duration-300 rounded-full ${
      scrolled ? 'shadow-lg backdrop-blur-md bg-white/95' : 'bg-white/80'
    }`}>
      <div className="flex justify-between items-center mx-auto max-w-7xl">
        {/* Logo with enhanced animation */}
        <Link to="/home" className="flex gap-2 items-center group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="p-2 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-full shadow-md group-hover:shadow-lg"
          >
            <Dumbbell className="w-5 h-5 text-white" />
          </motion.div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-400 transition-all group-hover:from-purple-500 group-hover:to-indigo-300">
            Eleweight
          </h1>
        </Link>
        
        {/* Desktop Navigation with improved hover effects */}
        <div className="hidden gap-6 items-center sm:flex">
          <div className="flex p-1 space-x-1 rounded-full bg-gray-100/50">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `relative text-base font-medium px-4 py-2 rounded-full transition-all flex items-center gap-1.5
                  ${isActive 
                    ? 'text-purple-600 bg-white shadow-sm' 
                    : scrolled 
                      ? 'text-gray-700 hover:text-purple-500 hover:bg-white/80' 
                      : 'text-gray-800 hover:text-purple-500 hover:bg-white/80'}`
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
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Food Analysis Camera Icon */}
          <NavLink
            to="/food-analysis"
            className={({ isActive }) => 
              `relative p-2 rounded-full transition-all
              ${isActive 
                ? 'text-white bg-gradient-to-r from-purple-600 to-purple-500 shadow-md' 
                : 'text-gray-700 hover:text-purple-500 hover:bg-gray-100'}`
            }
            title="Analyze Food"
          >
            <ScanLine className="w-5 h-5" />
          </NavLink>
         
          {/* Enhanced Profile Section with Dropdown */}
          <div className="relative pl-4 border-l border-gray-200" ref={dropdownRef}>
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex gap-2 items-center p-1.5 rounded-full transition-colors group hover:bg-gray-50/80"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  className="object-cover w-9 h-9 rounded-full border-2 border-white shadow-sm transition-all group-hover:shadow-md"
                  src={profileImage}
                  alt="Profile"
                />
                <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </motion.div>
              <span className="hidden text-sm font-medium text-gray-700 group-hover:text-purple-600 md:block">
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
                  className="overflow-hidden absolute right-0 z-50 mt-2 w-72 bg-white rounded-2xl border border-gray-100 shadow-lg"
                >
                  <div className="p-4">
                    <div className="flex gap-4 items-center mb-4">
                      <div className="relative group">
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="object-cover w-16 h-16 rounded-full border-2 border-white shadow-md"
                        />
                        <button 
                          onClick={triggerFileInput}
                          className="flex absolute inset-0 justify-center items-center rounded-full opacity-0 transition-opacity bg-black/50 group-hover:opacity-100"
                        >
                          <ScanLine className="w-5 h-5 text-white" />
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

                    <div className="pt-3 mt-2 border-t border-gray-100">
                      <button 
                        onClick={handleLogOut}
                        className="flex gap-2 items-center px-3 py-2 w-full text-sm text-left text-red-600 rounded-md transition-colors hover:bg-red-50"
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
        <div className="flex gap-2 items-center sm:hidden">
          {/* Food Analysis Camera Icon for Mobile */}
          <NavLink
            to="/food-analysis"
            className={({ isActive }) => 
              `relative p-2 rounded-full transition-all
              ${isActive 
                ? 'text-white bg-gradient-to-r from-purple-600 to-purple-500 shadow-md' 
                : 'text-gray-700 hover:text-purple-500 hover:bg-gray-100'}`
            }
            title="Analyze Food"
          >
            <ScanLine className="w-5 h-5" />
          </NavLink>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full backdrop-blur-sm transition-colors bg-gray-50/80 hover:bg-gray-100"
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
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden absolute right-0 left-0 top-20 z-50 mx-4 rounded-2xl border border-gray-100 shadow-xl backdrop-blur-lg bg-white/95 sm:hidden"
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
                        ? 'bg-purple-50 text-purple-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                    }
                  >
                    <span className="flex gap-2 items-center">
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
                <div className="pt-3 mt-2 border-t border-gray-100">
                  <div className="px-4 py-3">
                    <div className="flex gap-3 items-center mb-3">
                      <div className="relative group">
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="object-cover w-16 h-16 rounded-full border-2 border-white shadow-md"
                        />
                        <button 
                          onClick={triggerFileInput}
                          className="flex absolute inset-0 justify-center items-center rounded-full opacity-0 transition-opacity bg-black/50 group-hover:opacity-100"
                        >
                          <ScanLine className="w-4 h-4 text-white" />
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
                      className="flex gap-2 items-center px-3 py-2 w-full text-sm text-left text-red-600 rounded-md transition-colors hover:bg-red-50"
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