import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Ensure token hasn't expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          let userInfo = {};
          try { userInfo = JSON.parse(localStorage.getItem('user_info')) || {}; } catch (e) {}
          setUser({
            email: decoded.sub,
            role: decoded.role,
            id: decoded.id, // if added to token
            companyName: userInfo.companyName
          });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.token) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser({
        email: res.data.email,
        role: res.data.role,
        id: res.data.id,
        companyName: res.data.companyName
      });
      localStorage.setItem('user_info', JSON.stringify({ companyName: res.data.companyName }));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return res.data;
    }
  };

  const loginWithGoogle = async (googleToken, role, phoneNo, name, companyName) => {
    const res = await axios.post('/api/auth/google', { token: googleToken, role, phoneNo, name, companyName });
    if (res.data.token) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser({
        email: res.data.email,
        role: res.data.role,
        id: res.data.id,
        companyName: res.data.companyName
      });
      localStorage.setItem('user_info', JSON.stringify({ companyName: res.data.companyName }));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    }
    return res.data;
  };

  const register = async (name, email, password, role, phoneNo, companyName) => {
    const res = await axios.post('/api/auth/register', { name, email, password, role, phoneNo, companyName });
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/';
  };

  const value = { user, token, login, loginWithGoogle, register, logout, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

