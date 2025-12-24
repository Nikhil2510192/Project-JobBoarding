import { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export type User = {
  name: string;
  profileCompleted?: boolean;
  resumeUploaded?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/getuser`, {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.user); // matches your backend response
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
