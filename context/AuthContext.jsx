"use client";
import axios, { AxiosError } from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";
import { apiUrl } from "../lib/utils";

export const AuthenticationContext = createContext(undefined);

export default function AuthContextProvider({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const getInitialUser = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${apiUrl}/users/getMe`, {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      console.log(err.response?.data?.message);
      setUser(null);
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
    }
  };

  const login = async (userData) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${apiUrl}/users/signin`, userData, {
        withCredentials: true,
      });
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.token}`;
      const userResponse = await axios.get(`${apiUrl}/users/getMe`, {
        withCredentials: true,
      });
      setUser(userResponse.data);
    } catch (err) {
      console.log(err.response?.data?.message || "Login failed");
      throw new Error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await axios.get(`${apiUrl}/users/logout`, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.log(
        err.response?.data?.message || "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInitialUser();
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{ login, logout, authChecked, user, setUser, isLoading }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
