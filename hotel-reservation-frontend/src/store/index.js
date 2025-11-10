import { create } from "zustand";
import { authAPI, hotelsAPI, roomsAPI, reservationsAPI } from "../lib/api";

// Auth Store
export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  signIn: async (email, password) => {
    console.log("🔐 Attempting login for:", email);
    try {
      const response = await authAPI.login(email, password);
      console.log("🔐 Login response:", response);

      if (response.success) {
        const user = {
          id: response.userId,
          email: response.email,
          fullName: response.fullName,
          role: response.role,
        };

        // Store JWT token
        if (response.token) {
          localStorage.setItem("auth_token", response.token);
          console.log("🔐 Token stored successfully");
        }

        set({ user, loading: false });
        console.log("🔐 Login successful, user set:", user);
        return { success: true };
      } else {
        console.error("🔐 Login failed:", response.message);
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error("🔐 Login error:", error);
      return { success: false, error: error.message };
    }
  },

  signUp: async (email, password, userData) => {
    console.log("📝 Attempting registration for:", email);
    try {
      const registerData = {
        email,
        password,
        fullName: userData.full_name || userData.fullName || "",
        phone: userData.phone || "",
      };
      console.log("📝 Registration data:", registerData);

      const response = await authAPI.register(registerData);
      console.log("📝 Registration response:", response);

      if (response.success) {
        // Store JWT token
        if (response.token) {
          localStorage.setItem("auth_token", response.token);
          console.log("📝 Token stored successfully");
        }
        return { success: true, data: response };
      } else {
        console.error("📝 Registration failed:", response.message);
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error("📝 Registration error:", error);
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      // Remove JWT token
      localStorage.removeItem("auth_token");
      authAPI.logout();
      set({ user: null, loading: false });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  initialize: async () => {
    try {
      const user = authAPI.getCurrentUser();
      set({ user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },
}));

// Hotels Store
export const useHotelsStore = create((set, get) => ({
  hotels: [],
  selectedHotel: null,
  loading: false,

  fetchHotels: async () => {
    set({ loading: true });
    try {
      const data = await hotelsAPI.getAll();
      set({ hotels: data, loading: false });
    } catch (error) {
      console.error("Error fetching hotels:", error);
      set({ loading: false });
    }
  },

  setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
}));

// Rooms Store
export const useRoomsStore = create((set, get) => ({
  rooms: [],
  availableRooms: [],
  selectedRoom: null,
  loading: false,
  searchFilters: {
    checkIn: null,
    checkOut: null,
    guests: 1,
    roomType: null,
    priceRange: [0, 10000],
    amenities: [],
  },

  fetchRooms: async (hotelId = null) => {
    set({ loading: true });
    try {
      const data = hotelId
        ? await roomsAPI.getByHotel(hotelId)
        : await roomsAPI.getAll();
      set({ rooms: data, loading: false });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      set({ loading: false });
    }
  },

  searchAvailableRooms: async (checkIn, checkOut, hotelId = null) => {
    set({ loading: true });
    try {
      const data = await roomsAPI.getAvailable(checkIn, checkOut, hotelId);
      set({ availableRooms: data, loading: false });
    } catch (error) {
      console.error("Error searching rooms:", error);
      set({ loading: false });
    }
  },

  setSelectedRoom: (room) => set({ selectedRoom: room }),

  updateSearchFilters: (filters) =>
    set({ searchFilters: { ...get().searchFilters, ...filters } }),
}));

// Reservations Store
export const useReservationsStore = create((set, get) => ({
  reservations: [],
  currentReservation: null,
  loading: false,

  fetchUserReservations: async (userId) => {
    set({ loading: true });
    try {
      const data = await reservationsAPI.getByUser(userId);
      set({ reservations: data, loading: false });
    } catch (error) {
      console.error("Error fetching reservations:", error);
      set({ loading: false });
    }
  },

  createReservation: async (reservationData) => {
    set({ loading: true });
    try {
      const data = await reservationsAPI.create(reservationData);
      const currentReservations = get().reservations;
      set({
        reservations: [...currentReservations, data],
        currentReservation: data,
        loading: false,
      });
      return { success: true, data };
    } catch (error) {
      console.error("Error creating reservation:", error);
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  cancelReservation: async (reservationId) => {
    set({ loading: true });
    try {
      await reservationsAPI.cancel(reservationId);
      const currentReservations = get().reservations;
      set({
        reservations: currentReservations.filter((r) => r.id !== reservationId),
        loading: false,
      });
      return { success: true };
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  updateReservation: async (id, updates) => {
    try {
      const data = await reservationsAPI.update(id, updates);
      const reservations = get().reservations;
      const updatedReservations = reservations.map((r) =>
        r.id === id ? { ...r, ...data } : r
      );
      set({ reservations: updatedReservations });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  setCurrentReservation: (reservation) =>
    set({ currentReservation: reservation }),
}));

// UI Store
export const useUIStore = create((set) => ({
  theme: "light",
  sidebarCollapsed: false,
  notifications: [],

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now(),
          timestamp: new Date(),
          ...notification,
        },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
