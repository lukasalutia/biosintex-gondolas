import { useState } from 'react';
import BiosintexLogo from './BiosintexLogo';

export default function Login({ onLogin }) {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), password })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #04101F 0%, #023E8A 60%, #0077B6 100%)' }}>
      {/* Top branding area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <BiosintexLogo className="mb-3" />
        <div className="mt-2 text-center">
          <p className="text-white/60 text-sm tracking-wide uppercase font-medium" style={{ letterSpacing: '0.12em' }}>
            Farmacia Perfecta
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full rounded-t-3xl bg-white px-6 pt-8 pb-10 shadow-2xl" style={{ minHeight: '380px' }}>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Iniciar sesión</h2>
        <p className="text-sm text-gray-400 mb-7">Ingresá tus credenciales para continuar</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Gonzalo García"
              autoComplete="name"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ '--tw-ring-color': '#0077B6' }}
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #0077B640'}
              onBlur={e => e.target.style.boxShadow = 'none'}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none transition-all"
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #0077B640'}
              onBlur={e => e.target.style.boxShadow = 'none'}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3.5 rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!nombre.trim() || !password || loading}
            className="w-full text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-98"
            style={{ background: loading ? '#0077B6' : 'linear-gradient(135deg, #0077B6, #023E8A)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Ingresando...
              </span>
            ) : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
