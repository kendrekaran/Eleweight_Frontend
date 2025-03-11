import React from 'react'
import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-white">
      <motion.div
        className="w-16 h-16 bg-purple-600"
        animate={{
          scale: [1, 1.5, 1.5, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"]
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 0.5
        }}
      />
    </div>
  )
}

export default Loader