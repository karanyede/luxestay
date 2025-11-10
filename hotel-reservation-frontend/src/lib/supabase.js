import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database table names
export const TABLES = {
  HOTELS: "hotels",
  ROOMS: "rooms",
  RESERVATIONS: "reservations",
  USERS: "users",
  REVIEWS: "reviews",
  AMENITIES: "amenities",
  ROOM_AMENITIES: "room_amenities",
};

// Supabase Auth helpers
export const auth = {
  signUp: (email, password, userData = {}) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: userData },
    }),

  signIn: (email, password) =>
    supabase.auth.signInWithPassword({ email, password }),

  signInWithGoogle: () => supabase.auth.signInWithOAuth({ provider: "google" }),

  signOut: () => supabase.auth.signOut(),

  resetPassword: (email) => supabase.auth.resetPasswordForEmail(email),

  getCurrentUser: () => supabase.auth.getUser(),

  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback),
};

// Database helpers
export const db = {
  // Hotels
  getHotels: () => supabase.from(TABLES.HOTELS).select("*"),

  // Rooms
  getRooms: (hotelId = null) => {
    let query = supabase.from(TABLES.ROOMS).select(`
        *,
        hotels(name, location),
        room_amenities(amenities(name, icon))
      `);

    if (hotelId) {
      query = query.eq("hotel_id", hotelId);
    }

    return query;
  },

  getAvailableRooms: (checkIn, checkOut, hotelId = null) => {
    let query = supabase
      .from(TABLES.ROOMS)
      .select(
        `
        *,
        hotels(name, location),
        room_amenities(amenities(name, icon))
      `
      )
      .eq("is_available", true);

    if (hotelId) {
      query = query.eq("hotel_id", hotelId);
    }

    return query;
  },

  // Reservations
  createReservation: (reservation) =>
    supabase.from(TABLES.RESERVATIONS).insert(reservation).select(),

  getUserReservations: (userId) =>
    supabase
      .from(TABLES.RESERVATIONS)
      .select(
        `
        *,
        rooms(*, hotels(name, location))
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),

  updateReservation: (id, updates) =>
    supabase.from(TABLES.RESERVATIONS).update(updates).eq("id", id).select(),

  // Reviews
  getRoomReviews: (roomId) =>
    supabase
      .from(TABLES.REVIEWS)
      .select(
        `
        *,
        users(full_name, avatar_url)
      `
      )
      .eq("room_id", roomId)
      .order("created_at", { ascending: false }),

  createReview: (review) =>
    supabase.from(TABLES.REVIEWS).insert(review).select(),

  // Real-time subscriptions
  subscribeToReservations: (callback) =>
    supabase
      .channel("reservations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLES.RESERVATIONS },
        callback
      )
      .subscribe(),

  subscribeToRooms: (callback) =>
    supabase
      .channel("rooms")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLES.ROOMS },
        callback
      )
      .subscribe(),
};

// Storage helpers
export const storage = {
  uploadRoomImage: async (file, roomId) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${roomId}-${Date.now()}.${fileExt}`;
    const filePath = `rooms/${fileName}`;

    const { data, error } = await supabase.storage
      .from("room-images")
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("room-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  },

  uploadUserAvatar: async (file, userId) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  },
};
