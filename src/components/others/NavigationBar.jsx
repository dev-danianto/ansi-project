import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AnimatedButton from "../ui/AnimatedButton";
import MobileMenu from "./MobileMenu";

// Navigation links with paths
const navLinks = [
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Blog", path: "/blog" },
  { label: "Contact Us", path: "/contact" },
  { label: "FAQ", path: "/faq" },
];

const NavigationBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white px-5 py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
        {/* Logo that navigates to homepage */}
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/")}
        >
          <h1 className="font-bold text-xl text-black">Hive</h1>
        </div>

        {/* Centered nav links */}
        <div className="hidden md:flex justify-center gap-8">
          {navLinks.map(({ label, path }, idx) => (
            <AnimatedButton
              key={idx}
              text={label}
              onClick={() => navigate(path)}
              className="font-medium"
            />
          ))}
        </div>

        {/* Buttons + Hamburger */}
        <div className="flex justify-end items-center gap-5">
          {/* Desktop buttons */}
          <div className="hidden md:flex gap-5 items-center">
            <AnimatedButton
              text="Sign Up"
              onClick={() => navigate("/signup")}
              className="bg-white shadow px-5 py-2 font-semibold rounded-3xl hover:bg-gray-100 transition-all"
            />
            <AnimatedButton
              text="Login"
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white shadow px-5 py-2 font-semibold rounded-3xl hover:bg-blue-700 transition-all"
            />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && <MobileMenu />}
    </nav>
  );
};

export default NavigationBar;
