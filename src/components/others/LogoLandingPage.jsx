import React from "react";
import { motion } from "framer-motion";

const Logo = ({ bgColor, letter, icon }) => {
  return (
    <motion.div
      className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center shadow-md`}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      {letter && (
        <span className="text-white text-2xl font-bold">{letter}</span>
      )}
      {icon && icon}
    </motion.div>
  );
};

export default Logo;
