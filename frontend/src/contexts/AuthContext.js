import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('chciai_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me')
        .then(res => { setUser(res.data); setLoading(false); })
        .catch(() => {
          localStorage.removeItem('chciai_token');
          delete api.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, client } = res.data;
    localStorage.setItem('chciai_token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(client);
    return client;
  }, []);

  const register = useCallback(async (email, password, company_name) => {
    const res = await api.post('/auth/register', { email, password, company_name });
    const { token: newToken, client } = res.data;
    localStorage.setItem('chciai_token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(client);
    return client;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('chciai_token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((data) => {
    setUser(prev => ({ ...prev, ...data }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
