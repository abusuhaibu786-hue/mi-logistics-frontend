import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

// Maps the Django user payload to the {name, email, role, initials} shape
// every page already expects from `currentUser` / `user`.
const mapUser = (apiUser) => ({
  name: apiUser.name,
  username: apiUser.username,
  email: apiUser.email,
  role: apiUser.role_label,
  initials: apiUser.initials,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mi-user')); } catch { return null; }
  });
  // True only while we're re-validating a token found in localStorage on
  // first load. Pages don't need to read this — App.jsx gates rendering
  // on it so protected routes don't flash/redirect before we know.
  const [checkingSession, setCheckingSession] = useState(!!localStorage.getItem('mi-token'));

  useEffect(() => {
    const token = localStorage.getItem('mi-token');
    if (!token) { setCheckingSession(false); return; }

    authService.me()
      .then(({ data }) => {
        const mapped = mapUser(data);
        setUser(mapped);
        localStorage.setItem('mi-user', JSON.stringify(mapped));
      })
      .catch(() => {
        // Token invalid/expired and refresh already failed inside the
        // axios interceptor by the time we get here — clear local state.
        setUser(null);
        localStorage.removeItem('mi-user');
        localStorage.removeItem('mi-token');
        localStorage.removeItem('mi-refresh-token');
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await authService.login(username, password);
      const mapped = mapUser(data.user);
      setUser(mapped);
      localStorage.setItem('mi-user', JSON.stringify(mapped));
      localStorage.setItem('mi-token', data.access);
      localStorage.setItem('mi-refresh-token', data.refresh);
      return { ok: true };
    } catch (err) {
      const message = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || (err.response?.status === 401 ? 'Invalid username or password' : 'Unable to sign in. Please try again.');
      return { ok: false, error: message };
    }
  };

  const signup = async (payload) => {
    try {
      const { data } = await authService.signup(payload);
      const mapped = mapUser(data.user);
      setUser(mapped);
      localStorage.setItem('mi-user', JSON.stringify(mapped));
      localStorage.setItem('mi-token', data.access);
      localStorage.setItem('mi-refresh-token', data.refresh);
      return { ok: true };
    } catch (err) {
      const fieldErrors = err.response?.data;
      const firstError = fieldErrors && typeof fieldErrors === 'object'
        ? Object.values(fieldErrors).flat()[0]
        : null;
      return { ok: false, error: firstError || 'Unable to create account. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mi-user');
    localStorage.removeItem('mi-token');
    localStorage.removeItem('mi-refresh-token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuth: !!user, checkingSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
