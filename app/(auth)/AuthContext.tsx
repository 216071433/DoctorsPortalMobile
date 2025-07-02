import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axios.post('https://careapi-fgix.onrender.com/api/v1/auth/login', {
        email,
        password
      });

      if (response.data) {
        if (response.data.role === 'doctor') {
          // Store the token in AsyncStorage
          await AsyncStorage.multiSet([
            ['token', response.data.id_token],
            ['doctor_id', response.data.user_id.toString()]
          ]);
          
          // Set authentication state
          setIsAuthenticated(true);
          // @ts-ignore: Suppress navigation type error for Dashboard route
          router.push("/(pages)/Dashboard");
          return;
        }

        setError("Not authorized");
        return;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      } else {
        setError('An unexpected error occurred');
      }
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    // Remove token from AsyncStorage
    await AsyncStorage.multiRemove(['token', 'doctor_id']);
    setIsAuthenticated(false);
    // @ts-ignore: Suppress navigation type error for Home route
    navigation.navigate("index");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};