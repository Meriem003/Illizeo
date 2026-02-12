import { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/authService';
import { AuthContext } from './AuthContextDefinition';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const isAdmin = useCallback(() => {
    return user?.is_admin === 1 || user?.is_admin === true;
  }, [user]);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  }), [user, login, logout, isAdmin]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};