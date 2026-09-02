import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Set when we could not verify the session for a reason worth telling the
  // member about — offline, server down. Never set for a plain rejected token.
  const [authError, setAuthError] = useState("");

  const checkAuth = useCallback(async () => {
    setAuthError("");
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser(data);
    } catch (err) {
      // Only clear tokens when the server actually rejected the session. A
      // dropped connection must leave the signed-in state alone, otherwise a
      // train tunnel logs the member out.
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } else {
        setAuthError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (formData) => {
    const data = await api.register(formData);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Logout even if server call fails
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const isApprovedMember = user?.membershipStatus === "APPROVED";

  const value = useMemo(() => ({
    user, loading, authError, isAdmin, isApprovedMember, login, register, logout, checkAuth,
  }), [user, loading, authError, isAdmin, isApprovedMember, login, register, logout, checkAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
