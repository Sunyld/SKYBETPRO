import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('skybet_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@skybet.com' && password === 'admin123') {
      const adminUser = {
        id: '1',
        name: 'Administrador',
        email: 'admin@skybet.com',
        balance: 250000, // 250,000 MZN
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('skybet_user', JSON.stringify(adminUser));
      return true;
    }
    
    if (email && password) {
      const newUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        balance: 2500 // 2,500 MZN bônus inicial
      };
      setUser(newUser);
      localStorage.setItem('skybet_user', JSON.stringify(newUser));
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      balance: 2500 // 2,500 MZN bônus inicial
    };
    
    setUser(newUser);
    localStorage.setItem('skybet_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skybet_user');
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: Math.max(0, user.balance + amount) };
      setUser(updatedUser);
      localStorage.setItem('skybet_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateBalance,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};