import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import Loader from '../components/Loader';

type AuthContextProps = {
  userData: User | null;
  handleLogin: (supaBaseUser: User, session: Session) => void;
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
    const sessionResponse = await AsyncStorage.getItem('@loginApp:session');

    if (response && sessionResponse) {
      const user = JSON.parse(response);
      const session = JSON.parse(sessionResponse);

      // Restaure a sessão do Supabase
      await supabase.auth.setSession(session);

      setUserData(user);
    }

    setLoading(false);
  };

  const handleLogin = (supaBaseUser: User, session: Session) => {
    setUserData(supaBaseUser);
    AsyncStorage.setItem('@loginApp:user', JSON.stringify(supaBaseUser));
    AsyncStorage.setItem('@loginApp:session', JSON.stringify(session));
  };

  const handleLogout = async () => {
    // Faça logout no Supabase
    await supabase.auth.signOut();

    // Remova os dados do AsyncStorage
    await AsyncStorage.removeItem('@loginApp:user');
    await AsyncStorage.removeItem('@loginApp:session');

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
