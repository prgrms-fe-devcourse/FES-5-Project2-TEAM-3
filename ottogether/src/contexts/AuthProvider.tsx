import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';

type User = {
  id: string;
  email: string;
};

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 초기 유저 가져오기
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({ id: user.id, email: user.email ?? '' });
      }
    });

    // 로그인/로그아웃 감지
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuth: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('<AuthProvider> 안에서만 사용할 수 있습니다.');
  return ctx;
}
