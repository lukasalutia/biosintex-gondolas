import { useState } from 'react';
import NuevaVisita from './NuevaVisita';
import Historial from './Historial';
import BiosintexLogo from './BiosintexLogo';

const tabs = [
  { id: 'nueva', label: 'Nueva Visita', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
  { id: 'historial', label: 'Mi Historial', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )}
];

export default function VendedorView({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('nueva');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-10" style={{ background: 'linear-gradient(135deg, #04101F, #023E8A)' }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <BiosintexLogo />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white/90 text-xs font-medium">{user.nombre}</p>
              <p className="text-white/50 text-xs">Vendedor</p>
            </div>
            <button
              onClick={onLogout}
              className="text-white/60 hover:text-white/90 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Salir"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab bar integrated in header */}
        <div className="flex border-t border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-white/80" />
              )}
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {activeTab === 'nueva' && <NuevaVisita user={user} />}
        {activeTab === 'historial' && <Historial userId={user.id} canDelete={true} />}
      </main>
    </div>
  );
}
