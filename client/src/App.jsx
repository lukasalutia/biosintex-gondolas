import { useState, useEffect } from 'react';
import Login from './components/Login';
import VendedorView from './components/VendedorView';
import GerenteView from './components/GerenteView';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('gondolas_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('gondolas_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('gondolas_user');
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;
  if (user.puesto === 'Gerente') return <GerenteView user={user} onLogout={handleLogout} />;
  return <VendedorView user={user} onLogout={handleLogout} />;
}
