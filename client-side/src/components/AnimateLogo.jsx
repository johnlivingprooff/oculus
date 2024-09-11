import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/imgs/oak-icon.png'

const LogoAnimation = ({ onAnimationComplete }) => {
  // You can customize the animation variants
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 1 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <img src={logo} alt="Logo" style={{ width: '150px', height: '150px' }} />
    </motion.div>
  );
};

export default LogoAnimation;
