// src/components/layout/Header.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Header = ({ user }) => {
  const { signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect is handled by the AuthContext
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">FEWS App</div>

          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden md:block font-medium">
                {user?.email || "User"}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{user?.email}</div>
                  <div className="text-gray-500 text-xs truncate">
                    User ID: {user?.id?.substring(0, 8)}...
                  </div>
                </div>
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
