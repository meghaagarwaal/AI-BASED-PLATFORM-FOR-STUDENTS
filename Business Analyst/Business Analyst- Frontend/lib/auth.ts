"use client";

import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthState({
          user: parsedUser,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          error: 'Failed to parse user data',
        });
      }
    } else {
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful login with mock data
      if (email && password) {
        const mockUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          name: email.split('@')[0],
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setAuthState({
          user: mockUser,
          isLoading: false,
          error: null,
        });
        
        return true;
      } else {
        throw new Error('Email and password are required');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful signup with mock data
      if (email && password && name) {
        const mockUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          name,
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setAuthState({
          user: mockUser,
          isLoading: false,
          error: null,
        });
        
        return true;
      } else {
        throw new Error('All fields are required');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...authState,
    login,
    signup,
    logout,
  };
};