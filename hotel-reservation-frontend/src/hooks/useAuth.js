// Authentication hook for hotel reservation system

import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../lib/supabase";

// Create Auth Context
const AuthContext = createContext({});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            phone: userData.phone,
            ...userData,
          },
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { data: null, error };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Reset password error:", error);
      return { data: null, error };
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Update password error:", error);
      return { data: null, error };
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Update profile error:", error);
      return { data: null, error };
    }
  };

  // Get user profile from database
  const getUserProfile = async () => {
    if (!user) return { data: null, error: "No user logged in" };

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Get user profile error:", error);
      return { data: null, error };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!session;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return (
      user?.user_metadata?.role === role || user?.app_metadata?.role === role
    );
  };

  // Get user's full name
  const getUserDisplayName = () => {
    if (!user) return "";

    return (
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User"
    );
  };

  // Get user's avatar URL
  const getUserAvatar = () => {
    return (
      user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
    );
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    getUserProfile,
    isAuthenticated,
    hasRole,
    getUserDisplayName,
    getUserAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// HOC for protected routes
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>Loading...</div>
        </div>
      );
    }

    if (!user) {
      // Redirect to login or show login prompt
      window.location.href = "/auth/login";
      return null;
    }

    return <Component {...props} />;
  };
};

// Hook for auth state in components
export const useAuthState = () => {
  const { user, loading, isAuthenticated } = useAuth();

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    isGuest: !user,
  };
};

export default useAuth;
