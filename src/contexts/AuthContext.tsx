import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabase/supabase-client";

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => void;
  signOut: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (data.user) {
        setUser(data.user);
        setLoading(false);
      }

      if (error) {
        console.error("Error fetching user:", error);
        setError(error.message);
        setLoading(false);
        return;
      }
    };
    getCurrentUser();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, signInWithGoogle, signOut, loading, error }}
    >
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
