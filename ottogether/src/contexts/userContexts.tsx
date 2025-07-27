import { createContext, useContext, useEffect, useState } from 'react';
import { getUserInfo } from '../supabase/Auth/getUserInfo';
import { supabase } from '../supabase/supabase';

type UserType = {
  id: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
};

type UserContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);

  const fetchUserInfo = async () => {
    const id = await getUserInfo('id');
    const email = await getUserInfo('email');
    const name = await getUserInfo('name');
    const phone = await getUserInfo('phone');

    setUser({ id, email, name, phone });
  };

  useEffect(() => {
    fetchUserInfo(); // 초기 실행

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserInfo();
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser는 반드시 UserProvider 내부에서 사용되어야 합니다.");
  }
  return context;
}