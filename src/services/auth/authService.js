import supabaseClient from "../config/supabaseClient";

/**
 * Service for handling authentication with Supabase
 */
const authService = {
  /**
   * Register a new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {Object} userData - Additional user data
   * @returns {Promise} - Registration result
   */
  register: async (email, password, userData = {}) => {
    try {
      // Register the user with Supabase Auth
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${userData.firstName || ""} ${
              userData.lastName || ""
            }`.trim(),
            username: email.split("@")[0], // Generate a username from email
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Sign in existing user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Login result
   */
  login: async (email, password) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Sign out the current user
   * @returns {Promise} - Logout result
   */
  logout: async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  /**
   * Get the current logged in user
   * @returns {Object} - Current user or null
   */
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  /**
   * Request password reset email
   * @param {string} email - User's email
   * @returns {Promise} - Reset request result
   */
  resetPassword: async (email) => {
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  /**
   * Sign in with Google
   * @returns {Promise} - Google sign in result
   */
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get current session
   * @returns {Promise} - Session data
   */
  getSession: async () => {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

export default authService;
