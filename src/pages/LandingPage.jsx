import React, { useState, useEffect } from "react";
import {
  Edit,
  Grid,
  Calendar,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import NavItem from "../components/others/NavItemLandingPage";
import Logo from "../components/others/LogoLandingPage";
import CalendarLogo from "../components/others/CalendarLogoLandingPage";
import {
  containerVariants,
  itemVariants,
  logoVariants,
  navItemVariants,
  floatAnimation,
  spinAnimation,
} from "../components/others/animations";

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-white p-5 relative overflow-hidden">
      {/* Colorful logos */}
      <motion.div
        className="absolute left-1/4 top-1/3 transform -translate-x-1/2 -translate-y-1/2"
        variants={logoVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        {...floatAnimation}
      >
        <Logo bgColor="bg-blue-500" letter="S" />
      </motion.div>

      <motion.div
        className="absolute right-1/4 top-1/3 transform translate-x-1/2 -translate-y-1/2"
        variants={logoVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        {...spinAnimation}
      >
        <Logo
          bgColor="bg-orange-500"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.5v15m7.5-7.5h-15"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.5v15m7.5-7.5h-15"
                transform="rotate(45 12 12)"
              />
            </svg>
          }
        />
      </motion.div>

      <motion.div
        className="absolute left-1/3 bottom-1/3 transform -translate-x-1/2 translate-y-1/2"
        variants={logoVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        {...floatAnimation}
      >
        <CalendarLogo />
      </motion.div>

      <motion.div
        className="absolute right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2"
        variants={logoVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        {...floatAnimation}
      >
        <Logo
          bgColor="bg-blue-600"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2 9l10 6 10-6M2 14l10 6 10-6"
              />
            </svg>
          }
        />
      </motion.div>

      <motion.div
        className="w-full max-w-4xl flex flex-col items-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Navigation Icons */}
        <div className="flex justify-center w-full my-8 gap-6 ">
          {["Create", "Manage", "Schedule", "Chat", "& more"].map(
            (text, index) => {
              const icons = [
                <Edit size={24} color="#000" />,
                <Grid size={24} color="#ff4500" />,
                <Calendar size={24} color="#4169e1" />,
                <MessageCircle size={24} color="#00cc66" />,
                <MoreHorizontal size={24} color="#6b7280" />,
              ];

              return (
                <motion.div
                  key={text}
                  variants={navItemVariants}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <NavItem icon={icons[index]} text={text} />
                </motion.div>
              );
            }
          )}
        </div>

        {/* Main Heading */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center text-gray-900 mb-8 leading-tight"
          variants={itemVariants}
        >
          One app for your
          <br />
          Activity and Adventure
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-xl text-center text-gray-600 mb-12 max-w-3xl"
          variants={itemVariants}
        >
          Save time, streamline operations, and deliver exceptional experiences
          you will love.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-12 rounded-full text-lg mb-4 transition-colors duration-300"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start My Journey
        </motion.button>

        {/* No Account Required Text */}
        <motion.p className="text-gray-500 text-center" variants={itemVariants}>
          Account required to
          <br />
          get started
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
