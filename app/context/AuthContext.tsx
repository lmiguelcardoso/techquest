import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import Loader from '../components/Loader';

type AuthContextProps = {
  userData: User | null;
  handleLogin: (supaBaseUser: User) => void;
  handleLogout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider = ({ children }: any) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadingUser();
  }, []);

  const loadingUser = async () => {
    const response = await AsyncStorage.getItem('@loginApp:user');
    if (response) {
      const data = JSON.parse(response);
      setUserData(data);
    }
    setLoading(false);
  };

  const handleLogin = (supaBaseUser: User) => {
    setUserData(supaBaseUser);
    AsyncStorage.setItem('@loginApp:user', JSON.stringify(supaBaseUser));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@loginApp:user'); // Remove os dados do AsyncStorage
    setUserData(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        userData,
        isAuthenticated: !!userData,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
