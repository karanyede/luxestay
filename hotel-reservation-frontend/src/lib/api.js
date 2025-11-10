// API service for Spring Boot backend
const API_BASE_URL = "http://localhost:8082/api";

// API utility functions
const api = {
  // Generic request handler
  request: async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("auth_token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log("🚀 API Request:", {
      method: config.method || "GET",
      url,
      headers: config.headers,
      body: config.body,
    });

    try {
      const response = await fetch(url, config);

      console.log("📡 API Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error:", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("✅ API Success:", data);
      return data;
    } catch (error) {
      console.error("💥 API request failed:", error);
      throw error;
    }
  },

  // GET request
  get: (endpoint, options = {}) =>
    api.request(endpoint, { method: "GET", ...options }),

  // POST request
  post: (endpoint, data, options = {}) =>
    api.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    }),

  // PUT request
  put: (endpoint, data, options = {}) =>
    api.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    }),

  // DELETE request
  delete: (endpoint, options = {}) =>
    api.request(endpoint, { method: "DELETE", ...options }),
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/auth/register", {
      email: userData.email,
      password: userData.passwordHash || userData.password,
      fullName: userData.fullName || "",
      phone: userData.phone || "",
    });

    if (response.success) {
      // Store user data in localStorage - userId from backend
      const user = {
        id: response.userId, // Backend returns userId, store as id for frontend
        userId: response.userId, // Also keep userId for backward compatibility
        email: response.email,
        fullName: response.fullName,
        role: response.role,
      };
      localStorage.setItem("user_data", JSON.stringify(user));
    }
    return response;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    if (response.success) {
      // Store user data in localStorage - userId from backend
      const user = {
        id: response.userId, // Backend returns userId, store as id for frontend
        userId: response.userId, // Also keep userId for backward compatibility
        email: response.email,
        fullName: response.fullName,
        role: response.role,
      };
      localStorage.setItem("user_data", JSON.stringify(user));
    }
    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("user_data");
    window.location.href = "/login";
  },

  // Get current user
  getCurrentUser: () => {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("user_data");
  },

  // Check if email exists
  checkEmail: async (email) => {
    return await api.get(
      `/auth/check-email?email=${encodeURIComponent(email)}`
    );
  },
};

// Hotels API
export const hotelsAPI = {
  getAll: () => api.get("/hotels"),
  getById: (id) => api.get(`/hotels/${id}`),
  create: (hotelData) => api.post("/hotels", hotelData),
  update: (id, hotelData) => api.put(`/hotels/${id}`, hotelData),
  delete: (id) => api.delete(`/hotels/${id}`),
};

// Rooms API
export const roomsAPI = {
  getAll: () => api.get("/rooms"),
  getById: (id) => api.get(`/rooms/${id}`),
  getAvailable: (checkIn, checkOut, hotelId) => {
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (hotelId) params.append("hotelId", hotelId);
    return api.get(`/rooms/available?${params.toString()}`);
  },
  getByHotel: (hotelId) => api.get(`/rooms/hotel/${hotelId}`),
  create: (roomData) => api.post("/rooms", roomData),
  update: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// Reservations API
export const reservationsAPI = {
  getAll: () => api.get("/reservations"),
  getById: (id) => api.get(`/reservations/${id}`),
  getByUser: (userId) => api.get(`/reservations/user/${userId}`),

  createReservation: async (reservationData) => {
    return await api.post("/reservations", {
      userId: reservationData.userId,
      roomId: reservationData.roomId,
      checkIn: reservationData.checkIn,
      checkOut: reservationData.checkOut,
      guestCount: reservationData.guestCount,
    });
  },

  processPayment: async (reservationId, paymentData) => {
    return await api.post(
      `/reservations/${reservationId}/payment`,
      paymentData
    );
  },

  cancelReservation: async (reservationId, userId) => {
    return await api.post(
      `/reservations/${reservationId}/cancel?userId=${userId}`
    );
  },

  update: (id, reservationData) =>
    api.put(`/reservations/${id}`, reservationData),
  delete: (id) => api.delete(`/reservations/${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
