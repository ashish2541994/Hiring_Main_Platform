import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import api from "../services/api";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const initialCheckDone = useRef(false);

  const persistAuth = useCallback(
    (userData, newAccessToken, newRefreshToken) => {
      if (newAccessToken) {
        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("accessToken", newAccessToken);
      }
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      }
    },
    [],
  );

  const clearAuth = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      initialCheckDone.current = true;
      return;
    }

    // IMPORTANT: Use stale-while-revalidate pattern.
    // Set cached user immediately for instant UX, then verify server-side.
    // If server is unreachable or slow, user stays logged in from cache.
    const cachedUser = (() => {
      try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    })();

    if (cachedUser) {
      setUser(cachedUser);
      setIsAuthenticated(true);
    }

    // Try to verify with server silently — if it fails, keep cached user.
    try {
      const response = await api.get("/auth/me");
      const userData = response.data.user;
      if (userData) {
        persistAuth(userData, null, null);
      }
    } catch (error) {
      // Only clear auth if we get a definitive 401 AND we have no cached user
      if (error.response?.status === 401 && !cachedUser) {
        clearAuth();
      }
      // Otherwise keep cached user — server might be down or refreshing gracefully
    } finally {
      setLoading(false);
      initialCheckDone.current = true;
    }
  }, [persistAuth, clearAuth]);

  useEffect(() => {
    if (!initialCheckDone.current) {
      checkAuth();
    }
  }, [checkAuth]);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const data = response.data;
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    const userData = data.user;

    if (!accessToken) {
      throw new Error("Login failed: no access token received");
    }

    persistAuth(userData, accessToken, refreshToken);
    return data;
  };

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    const data = response.data;
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    const userObj = data.user;

    if (accessToken) {
      persistAuth(userObj, accessToken, refreshToken);
    }
    return data;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await api.post("/auth/logout", { refreshToken });
    } catch (error) {
      console.warn("Logout API error:", error.message);
    } finally {
      clearAuth();
    }
  };

  const updateUser = (updatedUser) => {
    if (updatedUser) {
      // DEEP MERGE: Preserve existing user fields (_id, role, email, etc.)
      // Only override with fields returned from the profile update
      const mergedUser = { ...user, ...updatedUser };
      setUser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
