// useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [authState, setAuthState] = useState(0); // New state to force re-renders

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setUserInfo(JSON.parse(user));
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setUserInfo(null);
      }
    };

    checkUserSession();
  }, []);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUserInfo(userData);
      setAuthState(prev => prev + 1); // Force re-render
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUserInfo(null);
      setAuthState(prev => prev + 1); // Force re-render
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
