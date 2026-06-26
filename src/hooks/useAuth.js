import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { getToken, setToken, removeToken, getUser, setUser } from '../utils/storage';

export function useAuth() {
  const [token, setTokenState] = useState(null);
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    const storedToken = await getToken();
    if (storedToken) {
      setTokenState(storedToken);
      const storedUser = await getUser();
      if (storedUser) setUserState(storedUser);
    }
    setLoading(false);
  }

  const login = useCallback(async (email, senha) => {
    const data = await api.auth.login(email, senha);
    await setToken(data.token);
    await setUser(data.usuario);
    setTokenState(data.token);
    setUserState(data.usuario);
    return data;
  }, []);

  const register = useCallback(async (nome, email, senha) => {
    const data = await api.auth.register(nome, email, senha);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    setTokenState(null);
    setUserState(null);
  }, []);

  return {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };
}
