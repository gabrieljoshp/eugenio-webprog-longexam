/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, refreshSession, signupUser } from "../services/UserService";

const AuthContext = createContext(null);

const responseData = (response) => response.data?.data || response.data || {};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const saveUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
      localStorage.setItem("role", nextUser.role);
      localStorage.setItem("firstName", nextUser.firstName || "");
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("firstName");
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    if (!user) return;
    refreshSession()
      .then((response) => saveUser(responseData(response).user))
      .catch(() => saveUser(null));
  // The stored session is restored once when the provider mounts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (credentials) => {
    setLoading(true);
    try {
      const data = responseData(await loginUser(credentials));
      saveUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (details) => {
    setLoading(true);
    try {
      const data = responseData(await signupUser(details));
      saveUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
    } finally {
      saveUser(null);
    }
  };

  return <AuthContext.Provider value={{ user, loading, signIn, register, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);