import React from "react";
import { motion } from "framer-motion";

const NavItem = ({ icon, text }) => {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer">
      <motion.div
        className="p-3 bg-white rounded-full shadow-sm flex items-center justify-center"
        whileHover={{
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
          y: -2,
        }}
      >
        {icon}
      </motion.div>
      <span className="text-gray-600 text-sm">{text}</span>
    </div>
  );
};

export default NavItem;
