import React, { createContext, useContext, useEffect, useState } from 'react';
import {  login, logout, register, getUserProfile} from '../api';

const AuthContext = createContext({
  user: null,
  loading: true,
  loginUser: async () => {},
  signupUser: async () => {},
  logoutUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const { data } = await getUserProfile();
        if (isMounted) setUser(data);
      } catch (err) {
        // User is not logged in (401), that's fine - stay logged out
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginUser = async (credentials) => {
    const { data } = await login(credentials);
    setUser(data.user);
    return data.user;
  };

  const signupUser = async (payload) => {
    const { data } = await register(payload);
    setUser(data.user);
    return data.user;
  };

  const logoutUser = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, signupUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
