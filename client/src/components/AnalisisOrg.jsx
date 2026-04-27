import { useState, useEffect } from 'react';

const estadoConfig = {
  optimo:  { label: 'Óptimo',  color: 'bg-green-100 text-green-700' },
  bueno:   { label: 'Bueno',   color: 'bg-blue-100 text-blue-700' },
  regular: { label: 'Regular', color: 'bg-yellow-100 text-yellow-700' },
  critico: { label: 'Crítico', color: 'bg-red-100 text-red-700' },
};

function ChipToggle({ label, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        selected
          ? 'text-white border-transparent'
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
      }`}
      style={selected ? { background: '#0077B6', borderColor: '#0077B6' } : {}}
    >
      {label}
    </button>
  );
}

function FilterScreen({ onGenerar, generarError }) {
  const [vendedores, setVendedores]       = useState([]);
  const [farmacias, setFarmacias]         = useState([]);
  const [selVendedores, setSelVendedores] = useState(new Set());
  const [selFarmacias, setSelFarmacias]   = useState(new Set());
  const [fechaDesde, setFechaDesde]       = useState('');
  const [fechaHasta, setFechaHasta]       = useState('');
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/vendedores').then(r => r.json()),
      fetch('/api/farmacias').then(r => r.json()),
    ]).then(([vData, fData]) => {
      const vList = Array.isArray(vData) ? vData : [];
      const fList = Array.isArray(fData) ? fData : [];
      setVendedores(vList);
      setFarmacias(fList);
      setSelVendedores(new Set(vList.map(v => v.id)));
      setSelFarmacias(new Set(fList));
      setLoading(false);
    }).catch(() => { setError('Error al cargar los filtros'); setLoading(false); });
  }, []);

  const toggleVendedor = (id) => {
    setSelVendedores(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFarmacia = (f) => {
    setSelFarmacias(prev => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  };

  const handleGenerar = () => {
    onGenerar({
      vendedores: selVendedores.size < vendedores.length ? [...selVendedores] : [],
      farmacias:  selFarmacias.size < farmacias.length   ? [...selFarmacias]  : [],
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    });
  };

  const hayFiltrosActivos =
    selVendedores.size < vendedores.length ||
    selFarmacias.size < farmacias.length ||
    fechaDesde || fechaHasta;

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Cargando filtros...</p>
    </div>
  );

  return (
    <div className="p-4 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="text-center pt-2 pb-1">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#EFF6FF' }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#0077B6' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
        </div>
        <h2 className="font-bold text-gray-900 text-base">Análisis Organizacional</h2>
        <p className="text-xs text-gray-400 mt-1">Seleccioná qué datos incluir en el análisis</p>
      </div>

      {(error || generarError) && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error || generarError}</div>
      )}

      {/* Filtro vendedores */}
      {vendedores.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Vendedores</p>
            <button
              onClick={() =>
                selVendedores.size === vendedores.length
                  ? setSelVendedores(new Set())
                  : setSelVendedores(new Set(vendedores.map(v => v.id)))
              }
              className="text-xs font-medium"
              style={{ color: '#0077B6' }}
            >
              {selVendedores.size === vendedores.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {vendedores.map(v => (
              <ChipToggle
                key={v.id}
                label={`${v.nombre} (${v.totalAnalisis})`}
                selected={selVendedores.has(v.id)}
                onToggle={() => toggleVendedor(v.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filtro farmacias */}
      {farmacias.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Farmacias</p>
            <button
              onClick={() =>
                selFarmacias.size === farmacias.length
                  ? setSelFarmacias(new Set())
                  : setSelFarmacias(new Set(farmacias))
              }
              className="text-xs font-medium"
              style={{ color: '#0077B6' }}
            >
              {selFarmacias.size === farmacias.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {farmacias.map(f => (
              <ChipToggle
                key={f}
                label={f}
                selected={selFarmacias.has(f)}
                onToggle={() => toggleFarmacia(f)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filtro fechas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Período</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #0077B640'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #0077B640'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
          </div>
        </div>
        {(fechaDesde || fechaHasta) && (
          <button onClick={() => { setFechaDesde(''); setFechaHasta(''); }} className="text-xs mt-2" style={{ color: '#0077B6' }}>
            Limpiar fechas
          </button>
        )}
      </div>

      {/* Resumen de selección */}
      {hayFiltrosActivos && (
        <div className="rounded-xl p-3 text-xs text-center" style={{ background: '#EFF6FF', color: '#0077B6' }}>
          {selVendedores.size < vendedores.length && `${selVendedores.size} vendedor${selVendedores.size !== 1 ? 'es' : ''} · `}
          {selFarmacias.size < farmacias.length && `${selFarmacias.size} farmacia${selFarmacias.size !== 1 ? 's' : ''} · `}
          {(fechaDesde || fechaHasta) && `${fechaDesde || '…'} → ${fechaHasta || '…'}`}
        </div>
      )}

      <button
        onClick={handleGenerar}
        disabled={selVendedores.size === 0 || selFarmacias.size === 0}
        className="w-full text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        style={{ background: 'linear-gradient(135deg, #0077B6, #023E8A)' }}
      >
        Generar análisis
      </button>
    </div>
  );
}

export default function AnalisisOrg() {
  const [fase, setFase]       = useState('filtros'); // 'filtros' | 'cargando' | 'resultado'
  const [analisis, setAnalisis] = useState(null);
  const [error, setError]     = useState('');

  const generar = async (filtros) => {
    setFase('cargando');
    setError('');
    try {
      const res = await fetch('/api/analisis-org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtros),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalisis(data);
      setFase('resultado');
    } catch (err) {
      setError(err.message);
      setFase('filtros');
    }
  };

  if (fase === 'filtros') return <FilterScreen onGenerar={generar} generarError={error} />;

  if (fase === 'cargando') return (
    <div className="p-8 flex flex-col items-center justify-center gap-4 min-h-64">
      <svg className="animate-spin w-8 h-8" style={{ color: '#0077B6' }} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-sm text-gray-500">Analizando datos del equipo...</p>
    </div>
  );

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900">Resumen Ejecutivo</h3>
          <span className={`text-xl font-bold ml-3 flex-shrink-0 ${
            analisis.puntajePromedioRed >= 8 ? 'text-green-600' :
            analisis.puntajePromedioRed >= 5 ? 'text-yellow-600' : 'text-red-600'
          }`}>{analisis.puntajePromedioRed}/10</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{analisis.resumenEjecutivo}</p>

        {analisis.alertas?.filter(a => a).length > 0 && (
          <div className="mt-3 bg-red-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-red-700 mb-1.5">Alertas</p>
            {analisis.alertas.map((a, i) => (
              <p key={i} className="text-xs text-red-600">• {a}</p>
            ))}
          </div>
        )}
      </div>

      {analisis.farmacias?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-2">Por Farmacia</p>
          <div className="space-y-2">
            {analisis.farmacias.map((f, i) => {
              const est = estadoConfig[f.estado] || estadoConfig.regular;
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 text-sm">{f.nombre}</span>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${est.color}`}>{est.label}</span>
                      <span className={`text-sm font-bold ${
                        f.puntajePromedio >= 8 ? 'text-green-600' :
                        f.puntajePromedio >= 5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{f.puntajePromedio}/10</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{f.cantidadVisitas} visita{f.cantidadVisitas !== 1 ? 's' : ''}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {f.fortalezas?.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-2.5">
                        <p className="text-xs font-semibold text-green-700 mb-1">Fortalezas</p>
                        {f.fortalezas.map((x, j) => <p key={j} className="text-xs text-green-600 leading-relaxed">• {x}</p>)}
                      </div>
                    )}
                    {f.oportunidades?.length > 0 && (
                      <div className="bg-orange-50 rounded-lg p-2.5">
                        <p className="text-xs font-semibold text-orange-700 mb-1">Mejoras</p>
                        {f.oportunidades.map((x, j) => <p key={j} className="text-xs text-orange-600 leading-relaxed">• {x}</p>)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {analisis.rankingCriterios?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h4 className="font-semibold text-gray-900 mb-3">Ranking de Criterios</h4>
          <div className="space-y-2.5">
            {[...analisis.rankingCriterios].sort((a, b) => b.promedioRed - a.promedioRed).map((c, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-700 flex-1 min-w-0 truncate">{c.criterio}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-20 bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${c.promedioRed >= 8 ? 'bg-green-500' : c.promedioRed >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${c.promedioRed * 10}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold w-7 text-right ${
                    c.promedioRed >= 8 ? 'text-green-600' : c.promedioRed >= 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{c.promedioRed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analisis.recomendacionesGlobales?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h4 className="font-semibold text-gray-900 mb-3">Recomendaciones Globales</h4>
          <ol className="space-y-2.5">
            {analisis.recomendacionesGlobales.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 text-white" style={{ background: '#0077B6' }}>{i + 1}</span>
                {r}
              </li>
            ))}
          </ol>
        </div>
      )}

      <button
        onClick={() => { setFase('filtros'); setAnalisis(null); }}
        className="w-full border border-gray-200 text-gray-500 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
      >
        Nuevo análisis
      </button>
    </div>
  );
}
