import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User, LoginCredentials, RegisterData } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication service - replace with real implementation
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@chronobid.com',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'dealer@chronobid.com',
    role: 'dealer',
    firstName: 'John',
    lastName: 'Dealer',
    company: 'Luxury Timepieces Inc.',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'consumer@chronobid.com',
    role: 'consumer',
    firstName: 'Jane',
    lastName: 'Consumer',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'wholesaler@chronobid.com',
    role: 'admin',
    firstName: 'Mike',
    lastName: 'Wholesaler',
    company: 'Global Watch Distribution',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('chronobid_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('chronobid_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Mock authentication - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    localStorage.setItem('chronobid_user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const register = async (data: RegisterData) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Mock registration - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      company: data.company,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    localStorage.setItem('chronobid_user', JSON.stringify(newUser));
    
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('chronobid_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const resetPassword = async (email: string) => {
    // Mock password reset - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', email);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!authState.user) return;
    
    // Mock profile update - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = {
      ...authState.user,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('chronobid_user', JSON.stringify(updatedUser));
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
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
