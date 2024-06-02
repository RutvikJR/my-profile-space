import React, { createContext, useState, useEffect } from 'react';

interface AuthContextValue {
  userId: string | null;
  setUserId: (userId: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const saveUserId = (newUserId: string | null) => {
    if (newUserId) {
      localStorage.setItem('userId', newUserId);
    } else {
      localStorage.removeItem('userId');
    }
    setUserId(newUserId);
  };

  return (
    <AuthContext.Provider value={{ userId, setUserId: saveUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };