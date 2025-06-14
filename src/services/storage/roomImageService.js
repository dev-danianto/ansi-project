// services/storage/roomImageService.js
import { supabaseClient } from "../config/supabaseClient";

/**
 * Service for managing room images
 */
const roomImageService = {
  /**
   * Upload a room image to Supabase Storage
   * @param {File} file - Image file to upload
   * @param {number} roomId - Room ID to associate with the image
   * @returns {Promise} - Upload result with URL
   */
  uploadRoomImage: async (file, roomId) => {
    try {
      // Create a unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${roomId}_${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;
      const filePath = `room_images/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabaseClient.storage
        .from("rooms")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL for the uploaded file
      const { data: urlData } = supabaseClient.storage
        .from("rooms")
        .getPublicUrl(filePath);

      // Update room record with image URL
      const { error: updateError } = await supabaseClient
        .from("rooms")
        .update({ image_url: urlData.publicUrl })
        .eq("room_id", roomId);

      if (updateError) throw updateError;

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading room image:", error);
      return { data: null, error };
    }
  },

  /**
   * Get images for a room
   * @param {number} roomId - Room ID
   * @returns {Promise} - Room image data
   */
  getRoomImage: async (roomId) => {
    try {
      const { data, error } = await supabaseClient
        .from("rooms")
        .select("image_url")
        .eq("room_id", roomId)
        .single();

      if (error) throw error;

      return { imageUrl: data.image_url, error: null };
    } catch (error) {
      console.error("Error getting room image:", error);
      return { imageUrl: null, error };
    }
  },

  /**
   * Delete a room image
   * @param {string} imageUrl - Full URL of the image to delete
   * @param {number} roomId - Room ID to update
   * @returns {Promise} - Deletion result
   */
  deleteRoomImage: async (imageUrl, roomId) => {
    try {
      // Extract path from URL
      const urlObj = new URL(imageUrl);
      const pathParts = urlObj.pathname.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `room_images/${fileName}`;

      // Delete from storage
      const { error: deleteError } = await supabaseClient.storage
        .from("rooms")
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update room record to remove image reference
      const { error: updateError } = await supabaseClient
        .from("rooms")
        .update({ image_url: null })
        .eq("room_id", roomId);

      if (updateError) throw updateError;

      return { success: true, error: null };
    } catch (error) {
      console.error("Error deleting room image:", error);
      return { success: false, error };
    }
  },
};

export default roomImageService;
