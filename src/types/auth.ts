export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher';
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  userRole: 'student' | 'teacher' | null;
  user: User | null;
  token: string | null;
}