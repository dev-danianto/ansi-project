import React from "react";
import { motion } from "framer-motion";
import AnimatedButton from "../ui/AnimatedButton";

const navLinks = ["About", "Services", "Blog", "Contact Us", "FAQ"];

const MobileMenu = () => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
      className="md:hidden mt-4 flex flex-col items-start gap-4"
    >
      {navLinks.map((label, idx) => (
        <AnimatedButton key={idx} text={label} className="font-medium" />
      ))}

      <div className="mt-3 flex flex-col gap-3 w-full">
        <AnimatedButton
          text="Sign Up"
          className="w-full bg-white shadow px-5 py-2 font-semibold rounded-3xl hover:bg-gray-100 transition-all"
        />
        <AnimatedButton
          text="Login"
          className="w-full bg-indigo-600 text-white shadow px-5 py-2 font-semibold rounded-3xl hover:bg-indigo-700 transition-all"
        />
      </div>
    </motion.div>
  );
};

export default MobileMenu;
