import { useState, useEffect } from 'react';

export default function Vendedores({ onSelectVendedor }) {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vendedores')
      .then(r => r.json())
      .then(data => { setVendedores(Array.isArray(data) ? data.filter(v => v.totalAnalisis > 0) : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Cargando equipo...</p>
    </div>
  );

  if (vendedores.length === 0) return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p className="text-gray-400 text-sm">No hay vendedores registrados todavía.</p>
      <p className="text-gray-300 text-xs mt-1">Los vendedores aparecen cuando ingresan a la app.</p>
    </div>
  );

  return (
    <div className="p-4 max-w-lg mx-auto space-y-3">
      <p className="text-xs text-gray-400 px-1">{vendedores.length} vendedor{vendedores.length !== 1 ? 'es' : ''} en el equipo</p>
      {vendedores.map(v => (
        <div
          key={v.id}
          onClick={() => onSelectVendedor(v)}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between cursor-pointer hover:border-teal-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <span className="text-teal-700 font-bold">{v.nombre.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{v.nombre}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {v.totalAnalisis} análisis
                {v.ultimaActividad && ` · ${new Date(v.ultimaActividad).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {v.puntajePromedio && (
              <span className={`text-sm font-bold ${
                parseFloat(v.puntajePromedio) >= 8 ? 'text-green-600' :
                parseFloat(v.puntajePromedio) >= 5 ? 'text-yellow-600' : 'text-red-600'
              }`}>{v.puntajePromedio}</span>
            )}
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
