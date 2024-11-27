import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextProps {
  signed: boolean;
  needPasswordReset: boolean;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
  requirePasswordReset: (state?: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [signed, setSigned] = useState(false);
  const [needPasswordReset, setNeedPasswordReset] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("auth") === "true";
    setSigned(isAuthenticated);
    setLoading(false);
  }, []);

  const signIn = () => {
    setSigned(true);
    sessionStorage.setItem("auth", "true");
  };

  const signOut = () => {
    setSigned(false);
    sessionStorage.removeItem("auth");
    sessionStorage.clear();
  };

  const requirePasswordReset = (state = true) => {
    setNeedPasswordReset(state);
  };

  return (
    <AuthContext.Provider
      value={{
        signed,
        needPasswordReset,
        loading,
        signIn,
        signOut,
        requirePasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
