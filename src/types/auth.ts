export type UserRole = "admin" | "dealer" | "consumer";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  accountType?: string; 
  firstName: string;
  lastName: string;
  phoneNo?: string;
  companyName?: string;
  bio?: string;
  address?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  profilePicture?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  status?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNo?: string;
  companyName?: string;
}
