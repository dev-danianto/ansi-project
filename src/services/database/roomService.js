import supabaseClient from "../config/supabaseClient";

/**
 * Service for managing rooms and bookings in the database
 */
const roomService = {
  /**
   * Get all available rooms with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise} - Rooms data
   */
  getRooms: async (filters = {}) => {
    try {
      let query = supabaseClient
        .from("rooms")
        .select(
          `
          *,
          buildings(name, address)
        `
        )
        .eq("is_available", true);

      // Apply filters if provided
      if (filters.buildingId) {
        query = query.eq("building_id", filters.buildingId);
      }

      if (filters.roomType) {
        query = query.eq("room_type", filters.roomType);
      }

      if (filters.capacity) {
        query = query.gte("capacity", filters.capacity);
      }

      if (filters.hasProjector) {
        query = query.eq("has_projector", true);
      }

      if (filters.hasAC) {
        query = query.eq("has_ac", true);
      }

      if (filters.searchQuery) {
        query = query.ilike("room_number", `%${filters.searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { rooms: data, error: null };
    } catch (error) {
      return { rooms: null, error };
    }
  },

  /**
   * Get a specific room by ID
   * @param {number} roomId - Room ID
   * @returns {Promise} - Room data
   */
  getRoomById: async (roomId) => {
    try {
      const { data, error } = await supabaseClient
        .from("rooms")
        .select(
          `
          *,
          buildings(name, address),
          room_facilities(*)
        `
        )
        .eq("room_id", roomId)
        .single();

      if (error) throw error;
      return { room: data, error: null };
    } catch (error) {
      return { room: null, error };
    }
  },

  /**
   * Create a booking for a room
   * @param {Object} bookingData - Booking data
   * @returns {Promise} - Booking result
   */
  createBooking: async (bookingData) => {
    try {
      const { data, error } = await supabaseClient
        .from("room_bookings")
        .insert([bookingData])
        .select();

      if (error) throw error;
      return { booking: data[0], error: null };
    } catch (error) {
      return { booking: null, error };
    }
  },

  /**
   * Check if a room is available at a specific time
   * @param {number} roomId - Room ID
   * @param {string} startTime - Start time ISO string
   * @param {string} endTime - End time ISO string
   * @returns {Promise<boolean>} - Whether room is available
   */
  checkRoomAvailability: async (roomId, startTime, endTime) => {
    try {
      // Get all bookings for this room that overlap with the requested time period
      const { data, error } = await supabaseClient
        .from("room_bookings")
        .select("*")
        .eq("room_id", roomId)
        .lt("start_time", endTime)
        .gt("end_time", startTime)
        .neq("status", "cancelled");

      if (error) throw error;

      // Room is available if no conflicting bookings exist
      return { available: data.length === 0, error: null };
    } catch (error) {
      return { available: false, error };
    }
  },

  /**
   * Get user's bookings
   * @param {string} userId - User ID
   * @returns {Promise} - Bookings data
   */
  getUserBookings: async (userId) => {
    try {
      const { data, error } = await supabaseClient
        .from("room_bookings")
        .select(
          `
          *,
          rooms(room_number, room_type, building_id, buildings(name))
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { bookings: data, error: null };
    } catch (error) {
      return { bookings: null, error };
    }
  },

  /**
   * Add a new room (admin function)
   * @param {Object} roomData - Room data
   * @returns {Promise} - Creation result
   */
  addRoom: async (roomData) => {
    try {
      const { data, error } = await supabaseClient
        .from("rooms")
        .insert([roomData])
        .select();

      if (error) throw error;
      return { room: data[0], error: null };
    } catch (error) {
      return { room: null, error };
    }
  },

  /**
   * Update room details
   * @param {number} roomId - Room ID
   * @param {Object} roomData - Updated room data
   * @returns {Promise} - Update result
   */
  updateRoom: async (roomId, roomData) => {
    try {
      const { data, error } = await supabaseClient
        .from("rooms")
        .update(roomData)
        .eq("room_id", roomId)
        .select();

      if (error) throw error;
      return { room: data[0], error: null };
    } catch (error) {
      return { room: null, error };
    }
  },

  /**
   * Toggle room availability
   * @param {number} roomId - Room ID
   * @param {boolean} isAvailable - Availability status
   * @returns {Promise} - Update result
   */
  toggleRoomAvailability: async (roomId, isAvailable) => {
    try {
      const { data, error } = await supabaseClient
        .from("rooms")
        .update({ is_available: isAvailable })
        .eq("room_id", roomId)
        .select();

      if (error) throw error;
      return { room: data[0], error: null };
    } catch (error) {
      return { room: null, error };
    }
  },

  /**
   * Delete a room (admin function)
   * @param {number} roomId - Room ID
   * @returns {Promise} - Deletion result
   */
  deleteRoom: async (roomId) => {
    try {
      // First check if room has any bookings
      const { data: bookings, error: bookingError } = await supabaseClient
        .from("room_bookings")
        .select("booking_id")
        .eq("room_id", roomId);

      if (bookingError) throw bookingError;

      // If room has bookings, don't allow deletion
      if (bookings && bookings.length > 0) {
        throw new Error("Cannot delete room with existing bookings");
      }

      // Proceed with deletion
      const { error } = await supabaseClient
        .from("rooms")
        .delete()
        .eq("room_id", roomId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Update booking status
   * @param {number} bookingId - Booking ID
   * @param {string} status - New status ('approved', 'cancelled', 'completed')
   * @returns {Promise} - Update result
   */
  updateBookingStatus: async (bookingId, status) => {
    try {
      const { data, error } = await supabaseClient
        .from("room_bookings")
        .update({ status })
        .eq("booking_id", bookingId)
        .select();

      if (error) throw error;
      return { booking: data[0], error: null };
    } catch (error) {
      return { booking: null, error };
    }
  },

  /**
   * Get all buildings
   * @returns {Promise} - Buildings data
   */
  getBuildings: async () => {
    try {
      const { data, error } = await supabaseClient
        .from("buildings")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      return { buildings: data, error: null };
    } catch (error) {
      return { buildings: null, error };
    }
  },

  /**
   * Add a new building (admin function)
   * @param {Object} buildingData - Building data
   * @returns {Promise} - Creation result
   */
  addBuilding: async (buildingData) => {
    try {
      const { data, error } = await supabaseClient
        .from("buildings")
        .insert([buildingData])
        .select();

      if (error) throw error;
      return { building: data[0], error: null };
    } catch (error) {
      return { building: null, error };
    }
  },
};

export default roomService;
