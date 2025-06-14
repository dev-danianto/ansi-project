import React from "react";
import { motion } from "framer-motion";

const CalendarLogo = () => {
  return (
    <motion.div
      className="w-12 h-12 bg-white rounded-md shadow-md flex flex-col overflow-hidden border border-gray-200"
      whileHover={{ scale: 1.1 }}
    >
      <div className="bg-blue-500 h-3 w-full"></div>
      <div className="flex items-center justify-center flex-grow">
        <span className="text-blue-500 font-bold text-lg">31</span>
      </div>
    </motion.div>
  );
};

export default CalendarLogo;
