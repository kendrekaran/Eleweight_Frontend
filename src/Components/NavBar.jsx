import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, X, Menu } from 'lucide-react';

const NavBar = () => {
  const [profileImage, setProfileImage] = useState('https://i.pinimg.com/474x/a3/cc/fd/a3ccfd7885e6cff94ebbbe40fd9e1611.jpg');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedPicture = localStorage.getItem('profilePicture');
      if (savedPicture) {
        setProfileImage(savedPicture);
      }
    };

    const handleProfileUpdate = (e) => {
      setProfileImage(e.detail.picture);
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profilePictureUpdate', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profilePictureUpdate', handleProfileUpdate);
    };
  }, []);

  const navLinks = [
    { path: "/home", name: "Home" },
    { path: "/muscle", name: "Exercises" },
    { path: "/plans", name: "Plans" },
    { path: "/diet", name: "Diet" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md w-full h-20 flex items-center justify-between px-4 sm:px-8 lg:px-44 shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Logo Section */}
      <Link 
        to="/home" 
        className="flex items-center gap-3 group "
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-2  bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl shadow-lg"
        >
          <Dumbbell className="w-6 h-6 text-white" />
        </motion.div>
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-400 bg-clip-text text-transparent">
          Eleweight
        </h1>
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center gap-8">
        <div className="flex space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `relative text-lg font-medium px-3 py-2 transition-colors
                ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
                      layoutId="underline"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Profile Image */}
        <Link
          to="/profile"
          className="ml-4 relative group"
        >
          <motion.img
            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-lg group-hover:border-blue-100 transition-colors"
            src={profileImage}
            alt="Profile"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <div className="absolute inset-0 rounded-full ring-0 group-hover:ring-2 ring-blue-200/50 transition-all duration-300" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-gray-700" />
        ) : (
          <Menu className="w-7 h-7 text-gray-700" />
        )}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl sm:hidden mx-4 rounded-xl"
          >
            <div className="flex flex-col p-4 space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `px-4 py-3 rounded-lg text-lg font-medium transition-colors
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-lg text-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;