import supabaseClient from "../config/supabaseClient";

/**
 * Service for managing users in the database
 */
const userService = {
  /**
   * Create a new user in the database
   * @param {Object} userData - User data to insert
   * @returns {Promise} - Create result
   */
  createUser: async (userData) => {
    try {
      const { data, error } = await supabaseClient
        .from("users")
        .insert([
          {
            user_id: userData.id, // Use Supabase Auth user ID
            username: userData.username,
            email: userData.email,
            full_name: userData.fullName,
            password_hash: "", // Password is managed by Supabase Auth
            is_active: true,
          },
        ])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get a user by ID
   * @param {string} userId - User ID
   * @returns {Promise} - User data
   */
  getUserById: async (userId) => {
    try {
      const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return { user: data, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  /**
   * Update a user's last login time
   * @param {string} userId - User ID
   * @returns {Promise} - Update result
   */
  updateLastLogin: async (userId) => {
    try {
      const { data, error } = await supabaseClient
        .from("users")
        .update({ last_login: new Date() })
        .eq("user_id", userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Set user role
   * @param {string} userId - User ID
   * @param {string} roleName - Role name
   * @returns {Promise} - Result
   */
  setUserRole: async (userId, roleName) => {
    try {
      const { data, error } = await supabaseClient
        .from("user_roles")
        .insert([{ user_id: userId, role_name: roleName }]);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Save user service selection
   * @param {string} userId - User ID
   * @param {number} serviceId - Service ID
   * @returns {Promise} - Result
   */
  saveServiceSelection: async (userId, serviceId) => {
    try {
      const { data, error } = await supabaseClient
        .from("user_services")
        .upsert({
          user_id: userId,
          service_id: serviceId,
          selected_at: new Date(),
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get user's selected service
   * @param {string} userId - User ID
   * @returns {Promise} - Service data
   */
  getUserService: async (userId) => {
    try {
      const { data, error } = await supabaseClient
        .from("user_services")
        .select("*, services(*)")
        .eq("user_id", userId)
        .order("selected_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"
      return { service: data, error: null };
    } catch (error) {
      return { service: null, error };
    }
  },
};

export default userService;
