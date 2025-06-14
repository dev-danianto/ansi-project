import React from "react";
import { motion } from "framer-motion";

// Images Logo
import googleLogo from "../../assets/images/google-logo.png";
import metaLogo from "../../assets/images/Meta-Logo.png";
import discordLogo from "../../assets/images/Discord-logo.png";
import facebookLogo from "../../assets/images/facebook-logo.png";
import microsoftLogo from "../../assets/images/microsoft-logo.png";
import openTableLogo from "../../assets/images/OpenTable_logo.png";

const companies = [
  { logo: discordLogo },
  { logo: facebookLogo },
  { logo: googleLogo },
  { logo: metaLogo },
  { logo: microsoftLogo },
  { logo: openTableLogo },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const TrustedByCompanies = () => {
  return (
    <motion.div
      className="w-full bg-white py-12 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl text-center text-gray-800 font-semibold mb-2">
          Trusted By 1000's of Companies
        </h2>
        <p className="text-center text-gray-500 max-w-2xl mx-auto">
          Donec pharetra feugiat at orci purus non faucibus viverra morbi id.
        </p>

        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 "
          variants={containerVariants}
        >
          {companies.map((company, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              variants={itemVariants}
            >
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-30 h-30 object-contain"
              />
              <span className="text-gray-600 text-sm font-medium mt-2">
                {company.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TrustedByCompanies;
