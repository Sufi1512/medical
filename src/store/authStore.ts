import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  full_name: string;
  email: string;
  role: 'doctor' | 'patient';
  specialty?: string;
  phone?: string;
  createdAt: Date;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (userData: {
    full_name: string;
    email: string;
    password: string;
    role: 'doctor' | 'patient';
    specialty?: string;
    phone?: string;
  }) => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  resetError: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockUser = {
            id: Math.random().toString(36).substring(2),
            full_name: 'John Doe',
            email,
            role: 'patient' as const,
            createdAt: new Date(),
          };
          set({ user: mockUser, isLoading: false });
        } catch (error) {
          set({ 
            error: 'Failed to sign in. Please check your credentials.', 
            isLoading: false 
          });
          throw error;
        }
      },

      signOut: () => {
        set({ user: null, error: null, isLoading: false });
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          const newUser = {
            id: Math.random().toString(36).substring(2),
            full_name: userData.full_name,
            email: userData.email,
            role: userData.role,
            specialty: userData.specialty,
            phone: userData.phone,
            createdAt: new Date(),
          };
          set({ user: newUser, isLoading: false });
        } catch (error) {
          set({ 
            error: 'Registration failed. Please try again.', 
            isLoading: false 
          });
          throw error;
        }
      },

      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      resetError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);