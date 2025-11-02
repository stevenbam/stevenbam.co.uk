import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  logout: (section: string) => void;
  isAuthenticated: (section: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logout = (section: string) => {
    sessionStorage.removeItem(`auth_${section.toLowerCase()}`);
    // Force page reload to reset authentication state
    window.location.reload();
  };

  const isAuthenticated = (section: string) => {
    return sessionStorage.getItem(`auth_${section.toLowerCase()}`) === 'true';
  };

  return (
    <AuthContext.Provider value={{ logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};