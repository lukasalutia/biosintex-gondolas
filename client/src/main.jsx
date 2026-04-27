import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Interceptor global: inyecta Authorization en todas las llamadas a /api/
const _fetch = window.fetch.bind(window);
window.fetch = async (input, init = {}) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    const raw  = localStorage.getItem('gondolas_user');
    const user = raw ? JSON.parse(raw) : null;
    if (user?.sessionToken) {
      init = { ...init, headers: { ...(init.headers || {}), 'Authorization': `Bearer ${user.sessionToken}` } };
    }
    const res = await _fetch(input, init);
    if (res.status === 401) {
      localStorage.removeItem('gondolas_user');
      window.location.reload();
      return res;
    }
    return res;
  }
  return _fetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
