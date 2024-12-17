import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { isFirstAcess } from '../shared/services/RequestService';

type AuthContextProps = {
  userData: User | null;
  handleLogin: (supaBaseUser: User, session: Session) => void;
  handleLogout: () => void;
  isAuthenticated: boolean;
  isFirstAccess: boolean;
  setIsFirstAccess: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider = ({ children }: any) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirstAccess, setIsFirstAccess] = useState<boolean>(true);

  useEffect(() => {
    loadingUser();
  }, []);

  useEffect(() => {
    const fetchFirstAccess = async () => {
      if (userData?.id) setIsFirstAccess(await isFirstAcess(userData?.id));
    };

    fetchFirstAccess();
  }, [userData]);

  const loadingUser = async () => {
    setLoading(true);
    const response = await AsyncStorage.getItem('@loginApp:user');
    const sessionResponse = await AsyncStorage.getItem('@loginApp:session');

    if (response && sessionResponse) {
      const user = JSON.parse(response);
      const session = JSON.parse(sessionResponse);

      const { data, error } = await supabase.auth.setSession(session);

      if (error || !data.session) {
        await AsyncStorage.removeItem('@loginApp:user');
        await AsyncStorage.removeItem('@loginApp:session');
        setUserData(null);
      } else {
        setUserData(user);
      }
    }

    setLoading(false);
  };
  const handleLogin = (supaBaseUser: User, session: Session) => {
    setUserData(supaBaseUser);
    AsyncStorage.setItem('@loginApp:user', JSON.stringify(supaBaseUser));
    AsyncStorage.setItem('@loginApp:session', JSON.stringify(session));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

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
        isFirstAccess,
        handleLogout,
        setIsFirstAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
