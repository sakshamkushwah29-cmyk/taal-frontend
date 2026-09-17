"use client";

import ROUTE_PATH from "@/libs/route-path";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";
import FestivalLoading from "@/components/common/FestivalLoading";

const AuthContext = createContext();

export const useAuthUser = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    let storedUser = localStorage.getItem("authUser");

    let interval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 15 : prev)); // ✅ Faster increment
    }, 100);

    setTimeout(() => {
      if (storedUser) {
        setAuthUser(JSON.parse(storedUser));
      }
      setIsAuthLoaded(true);
      clearInterval(interval);
      setProgress(100);
    }, 800);
  }, []);

  const login = async (response) => {
    let { token } = response;
    const userData = {
      user: response,
      isAuthenticated: true,
      token,
    };

    console.log("User logged in:", userData);

    setAuthUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = async () => {
    setAuthUser(null);
    localStorage.removeItem("authUser");
    router.push(ROUTE_PATH.AUTH.LOGIN);
  };

  const updateUser = (user) => {
    setAuthUser((prev) => ({ ...prev, user }));
  };

  if (!isAuthLoaded) {
    return <FestivalLoading progress={progress} />;
  }

  return (
    <AuthContext.Provider value={{ authUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
