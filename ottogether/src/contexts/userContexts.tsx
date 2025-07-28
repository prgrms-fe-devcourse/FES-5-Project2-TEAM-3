import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';


type UserType = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
} | null;

type UserContextType = {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata?.name ?? '',
          phone: data.user.phone ?? '',
        });
      } else {
        setUser(null);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          email: u.email ?? '',
          name: u.user_metadata?.name ?? '',
          phone: u.phone ?? '',
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser는 반드시 UserProvider 안에서 사용되어야 합니다.');
  }
  return context;
};