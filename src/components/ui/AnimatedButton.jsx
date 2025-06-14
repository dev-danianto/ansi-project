import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const AnimatedButton = ({ text, className = "", onClick }) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const controlsArray = text.split("").map(() => useAnimation());

  useEffect(() => {
    const interval = setInterval(() => {
      controlsArray.forEach((controls, i) => {
        controls.start({
          y: [0, -2, 0],
          transition: {
            duration: 0.6,
            ease: "easeInOut",
            delay: i * 0.05,
          },
        });
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [controlsArray]);

  return (
    <motion.button
      className={className}
      onClick={onClick} // ✅ handle click here
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          className="inline-block"
          animate={controlsArray[i]}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.button>
  );
};

export default AnimatedButton;
