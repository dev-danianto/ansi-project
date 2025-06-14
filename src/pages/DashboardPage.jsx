import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabaseClient } from "../services";
import { motion } from "framer-motion";
import {
  FiHome,
  FiCalendar,
  FiCheckSquare,
  FiLogOut,
  FiUser,
  FiSettings,
  FiEdit,
  FiSave,
  FiX,
  FiBell,
  FiShield,
  FiHelpCircle,
  FiCreditCard,
} from "react-icons/fi";

const DashboardPage = () => {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    full_name: "",
  });
  const [stats, setStats] = useState({
    roomBookings: 0,
    activeVotes: 0,
    userVotes: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userSettings, setUserSettings] = useState({
    notifications: true,
    darkMode: false,
    twoFactorAuth: false,
    language: "English",
  });

  // Fetch all user data
  useEffect(() => {
    const fetchAllData = async () => {
      if (user && user.id) {
        try {
          setIsLoading(true);

          // Fetch user profile
          const { data: profileData, error: profileError } =
            await supabaseClient
              .from("users")
              .select("*")
              .eq("auth_id", user.id)
              .single();

          if (profileError) throw profileError;
          setUserProfile(profileData);
          setEditFormData({
            username: profileData.username || "",
            email: profileData.email || "",
            full_name: profileData.full_name || "",
          });

          // Fetch room bookings count
          const { count: bookingsCount, error: bookingsError } =
            await supabaseClient
              .from("room_bookings")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profileData.user_id);

          if (bookingsError) throw bookingsError;

          // Fetch active polls count
          const { count: activePollsCount, error: pollsError } =
            await supabaseClient
              .from("polls")
              .select("*", { count: "exact", head: true })
              .gt("end_date", new Date().toISOString())
              .lt("start_date", new Date().toISOString());

          if (pollsError) throw pollsError;

          // Fetch user votes count
          const { count: userVotesCount, error: votesError } =
            await supabaseClient
              .from("votes")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profileData.user_id);

          if (votesError) throw votesError;

          // Fetch recent activities
          const { data: activitiesData, error: activitiesError } =
            await supabaseClient
              .rpc("get_user_activities", { user_id: profileData.user_id })
              .limit(3);

          if (activitiesError) throw activitiesError;

          setStats({
            roomBookings: bookingsCount || 0,
            activeVotes: activePollsCount || 0,
            userVotes: userVotesCount || 0,
          });

          setRecentActivities(activitiesData || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAllData();
  }, [user]);

  // Update greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hours = currentTime.getHours();
      if (hours < 12) {
        setGreeting("Good Morning");
      } else if (hours < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [currentTime]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleRoomFinderClick = () => {
    navigate("/room-finder");
  };

  const handleVoteAppClick = () => {
    navigate("/vote");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleOpenEditModal = () => {
    setIsEditProfileModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleCloseModals = () => {
    setIsEditProfileModalOpen(false);
    setIsSettingsModalOpen(false);
    setEditFormData({
      username: userProfile?.username || "",
      email: userProfile?.email || "",
      full_name: userProfile?.full_name || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSettingChange = (setting, value) => {
    setUserSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("users")
        .update({
          username: editFormData.username,
          email: editFormData.email,
          full_name: editFormData.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_id", user.id)
        .select();

      if (error) throw error;

      setUserProfile(data[0]);
      setIsEditProfileModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSaveSettings = async () => {
    // In a real app, you would save these settings to the database
    console.log("Saving settings:", userSettings);
    // Example implementation:
    // const { error } = await supabaseClient
    //   .from("user_settings")
    //   .upsert({
    //     user_id: userProfile.user_id,
    //     settings: userSettings,
    //   });

    setIsSettingsModalOpen(false);
    // Show a success notification here
  };

  if (loading || !isAuthenticated || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Modal Components
  const EditProfileModal = () => {
    if (!isEditProfileModalOpen) return null;

    const handleSaveProfile = async () => {
      try {
        setIsLoading(true);

        // Update auth email if changed
        if (editFormData.email !== user.email) {
          const { error: authError } = await supabaseClient.auth.updateUser({
            email: editFormData.email,
          });
          if (authError) throw authError;
        }

        // Update public.users profile (without updated_at)
        const { data, error } = await supabaseClient
          .from("users")
          .update({
            username: editFormData.username,
            email: editFormData.email,
            full_name: editFormData.full_name,
          })
          .eq("auth_id", user.id)
          .select();

        if (error) throw error;

        setUserProfile(data[0]);
        setIsEditProfileModalOpen(false);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert(`Error updating profile: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleCloseModals}
        ></div>
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FiUser className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Edit Profile
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={editFormData.username}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="full_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        value={editFormData.full_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={handleCloseModals}
                disabled={isLoading}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SettingsModal = () => {
    if (!isSettingsModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleCloseModals}
        ></div>
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FiSettings className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Application Settings
                  </h3>
                  <div className="mt-4 space-y-6">
                    {/* Notifications */}
                    <div>
                      <h4 className="mb-2 flex items-center font-medium text-gray-800">
                        <FiBell className="mr-2" /> Notifications
                      </h4>
                      <div className="flex items-center">
                        <input
                          id="notifications"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={userSettings.notifications}
                          onChange={(e) =>
                            handleSettingChange(
                              "notifications",
                              e.target.checked
                            )
                          }
                        />
                        <label
                          htmlFor="notifications"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Enable notifications
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Receive notifications about your bookings, votes, and
                        other activities
                      </p>
                    </div>

                    {/* Dark Mode */}
                    <div>
                      <h4 className="mb-2 flex items-center font-medium text-gray-800">
                        <FiUser className="mr-2" /> Appearance
                      </h4>
                      <div className="flex items-center">
                        <input
                          id="darkMode"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={userSettings.darkMode}
                          onChange={(e) =>
                            handleSettingChange("darkMode", e.target.checked)
                          }
                        />
                        <label
                          htmlFor="darkMode"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Dark mode
                        </label>
                      </div>
                    </div>

                    {/* Security */}
                    <div>
                      <h4 className="mb-2 flex items-center font-medium text-gray-800">
                        <FiShield className="mr-2" /> Security
                      </h4>
                      <div className="flex items-center">
                        <input
                          id="twoFactorAuth"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={userSettings.twoFactorAuth}
                          onChange={(e) =>
                            handleSettingChange(
                              "twoFactorAuth",
                              e.target.checked
                            )
                          }
                        />
                        <label
                          htmlFor="twoFactorAuth"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Enable two-factor authentication
                        </label>
                      </div>
                      <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                        Change password
                      </button>
                    </div>

                    {/* Language */}
                    <div>
                      <h4 className="mb-2 flex items-center font-medium text-gray-800">
                        <FiHelpCircle className="mr-2" /> Language
                      </h4>
                      <select
                        value={userSettings.language}
                        onChange={(e) =>
                          handleSettingChange("language", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>

                    {/* Billing Link */}
                    <div>
                      <h4 className="mb-2 flex items-center font-medium text-gray-800">
                        <FiCreditCard className="mr-2" /> Billing
                      </h4>
                      <button
                        onClick={() => navigate("/billing")}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Manage subscription and payment methods
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save Settings
              </button>
              <button
                type="button"
                onClick={handleCloseModals}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white hover:shadow-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Hive Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {userProfile?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                  {userProfile?.username || "User"}
                </span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleOpenEditModal}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleOpenSettingsModal}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FiSettings className="mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FiLogOut className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {greeting},{" "}
              {userProfile?.full_name || userProfile?.username || "User"}!
            </h2>
            <p className="text-gray-600">
              Welcome back to your Hive dashboard. Here's what you can do today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500">
              <h3 className="text-lg font-medium text-gray-900">
                Room Bookings
              </h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {stats.roomBookings}
              </p>
              <p className="mt-1 text-sm text-gray-500">Upcoming bookings</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500">
              <h3 className="text-lg font-medium text-gray-900">
                Active Votes
              </h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {stats.activeVotes}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Polls you can participate in
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500">
              <h3 className="text-lg font-medium text-gray-900">Your Votes</h3>
              <p className="mt-2 text-3xl font-bold text-purple-600">
                {stats.userVotes}
              </p>
              <p className="mt-1 text-sm text-gray-500">Total votes cast</p>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room Finder Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-blue-500 cursor-pointer"
              onClick={handleRoomFinderClick}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                    <FiCalendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Room Finder
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Find and book available rooms for your meetings or events.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Find a Room
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Vote App Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-blue-500 cursor-pointer"
              onClick={handleVoteAppClick}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                    <FiCheckSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Vote App
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Participate in polls and votes or create your own surveys.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    View Polls
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity Section */}
          {recentActivities.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {recentActivities.map((activity, index) => (
                    <li key={index} className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 ${
                            getActivityColor(activity.type).bg
                          } rounded-md p-2`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTimeAgo(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Hive. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Render modals */}
      <EditProfileModal />
      <SettingsModal />
    </div>
  );
};

// Helper functions
function getActivityIcon(type) {
  switch (type) {
    case "booking":
      return <FiCalendar className="h-5 w-5 text-blue-600" />;
    case "vote":
      return <FiCheckSquare className="h-5 w-5 text-green-600" />;
    default:
      return <FiUser className="h-5 w-5 text-purple-600" />;
  }
}

function getActivityColor(type) {
  switch (type) {
    case "booking":
      return { bg: "bg-blue-100", text: "text-blue-600" };
    case "vote":
      return { bg: "bg-green-100", text: "text-green-600" };
    default:
      return { bg: "bg-purple-100", text: "text-purple-600" };
  }
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return `${interval} minute${interval === 1 ? "" : "s"} ago`;

  return `${Math.floor(seconds)} second${seconds === 1 ? "" : "s"} ago`;
}

export default DashboardPage;
