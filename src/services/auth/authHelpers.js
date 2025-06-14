import supabaseClient from "../config/supabaseClient";

/**
 * Helper functions for authentication
 */
const authHelpers = {
  /**
   * Subscribe to auth state changes
   * @param {Function} callback - Function to call on auth state change
   * @returns {Object} - Subscription data
   */
  onAuthStateChange: (callback) => {
    return supabaseClient.auth.onAuthStateChange(callback);
  },

  /**
   * Checks if a user has a specific role
   * @param {string} userId - User ID to check
   * @param {string} roleName - Role name to check for
   * @returns {Promise<boolean>} - Whether user has the role
   */
  hasRole: async (userId, roleName) => {
    try {
      const { data, error } = await supabaseClient
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role_name", roleName)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking role:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error checking role:", error);
      return false;
    }
  },

  /**
   * Checks if the current user is authenticated
   * @returns {Promise<boolean>} - Whether user is authenticated
   */
  isAuthenticated: async () => {
    try {
      const { data } = await supabaseClient.auth.getSession();
      return !!data.session;
    } catch (error) {
      return false;
    }
  },
};

export default authHelpers;
