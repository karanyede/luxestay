import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider, App as AntApp, Spin } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, useUIStore } from "./store";
import { getAntdTheme } from "./styles/theme";
import { auth } from "./lib/supabase";
import { AuthProvider } from "./hooks/useAuth";

// Layout Components
import MainLayout from "./components/Layout/MainLayout";
import AuthLayout from "./components/Layout/AuthLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import HotelsPage from "./pages/Hotels/HotelsPage";
import RoomsPage from "./pages/Rooms/RoomsPage";
import RoomDetailsPage from "./pages/Rooms/RoomDetailsPage";
import BookingPage from "./pages/Booking/BookingPage";
import AdvancedBookingPage from "./pages/Booking/AdvancedBookingPage";
import UserBookingsPage from "./pages/Booking/UserBookingsPage";
import BookingConfirmationPage from "./pages/Booking/BookingConfirmationPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ReservationsPage from "./pages/Reservations/ReservationsPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";

// Styles
import "./App.css";

function App() {
  const { user, loading, initialize } = useAuthStore();
  const { theme } = useUIStore();

  useEffect(() => {
    // Initialize auth state
    initialize();

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        useAuthStore.getState().setUser(session?.user || null);
      } else if (event === "SIGNED_OUT") {
        useAuthStore.getState().setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, [initialize]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: theme === "dark" ? "#141414" : "#ffffff",
        }}
      >
        <Spin size="large" tip="Loading LuxeStay..." />
      </div>
    );
  }

  return (
    <AuthProvider>
      <ConfigProvider theme={getAntdTheme(theme === "dark")}>
        <AntApp>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth Routes */}
                <Route
                  path="/login"
                  element={
                    user ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <AuthLayout>
                        <LoginPage />
                      </AuthLayout>
                    )
                  }
                />
                <Route
                  path="/register"
                  element={
                    user ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <AuthLayout>
                        <RegisterPage />
                      </AuthLayout>
                    )
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    user ? (
                      <MainLayout>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <DashboardPage />
                        </motion.div>
                      </MainLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/hotels"
                  element={
                    <MainLayout>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <HotelsPage />
                      </motion.div>
                    </MainLayout>
                  }
                />

                <Route
                  path="/rooms"
                  element={
                    <MainLayout>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RoomsPage />
                      </motion.div>
                    </MainLayout>
                  }
                />

                <Route
                  path="/rooms/:id"
                  element={
                    <MainLayout>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RoomDetailsPage />
                      </motion.div>
                    </MainLayout>
                  }
                />

                <Route
                  path="/booking"
                  element={
                    user ? (
                      <MainLayout>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <BookingPage />
                        </motion.div>
                      </MainLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/booking/advanced"
                  element={
                    <MainLayout>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AdvancedBookingPage />
                      </motion.div>
                    </MainLayout>
                  }
                />

                <Route
                  path="/my-bookings"
                  element={
                    user ? (
                      <MainLayout>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <UserBookingsPage />
                        </motion.div>
                      </MainLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/booking/confirmation/:id"
                  element={
                    user ? (
                      <MainLayout>
                        <BookingConfirmationPage />
                      </MainLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/profile"
                  element={
                    user ? (
                      <MainLayout>
                        <ProfilePage />
                      </MainLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/reservations"
                  element={
                    user ? (
                      <MainLayout>
                        <ReservationsPage />
                      </MainLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    user && user.user_metadata?.role === "admin" ? (
                      <MainLayout>
                        <AdminDashboard />
                      </MainLayout>
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Router>
        </AntApp>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
