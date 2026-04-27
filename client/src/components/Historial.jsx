import { useState, useEffect } from 'react';

function ScoreBadge({ score }) {
  const color = score >= 8 ? 'bg-green-100 text-green-700' : score >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>{score}/10</span>;
}

function TipoBadge({ tipo }) {
  const styles = {
    otc: 'bg-blue-100 text-blue-600',
    cosmetica: 'bg-pink-100 text-pink-600',
    mixta: 'bg-purple-100 text-purple-600',
    A: 'bg-emerald-100 text-emerald-600',
    B: 'bg-amber-100 text-amber-600',
    C: 'bg-orange-100 text-orange-600',
  };
  const labels = { otc: 'OTC', cosmetica: 'Cosmética', mixta: 'Mixta', A: 'Tienda A', B: 'Tienda B', C: 'Tienda C' };
  if (!tipo) return null;
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[tipo] || 'bg-gray-100 text-gray-500'}`}>{labels[tipo] || tipo}</span>;
}

function formatFecha(fechaStr) {
  const d = new Date(fechaStr);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function AnalisisCard({ item, canDelete, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`¿Borrar el análisis de ${item.farmacia}?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/analisis/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al borrar');
      onDelete(item.id);
    } catch {
      alert('Error al borrar el análisis');
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
            <img src={`/uploads/${item.foto || item.fotos?.[0]}`} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">{formatFecha(item.fecha)}</p>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {item.analisis.tipoGondola && <TipoBadge tipo={item.analisis.tipoGondola} />}
              {(item.analisis.tipoTienda || item.tipoTiendaDeclarado) && (
                <TipoBadge tipo={item.analisis.tipoTienda || item.tipoTiendaDeclarado} />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <ScoreBadge score={item.analisis.puntajeTotal} />
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
              title="Borrar análisis"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <span className="text-gray-300 text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          {(item.fotos || [item.foto]).filter(Boolean).map((f, i) => (
            <img key={i} src={`/uploads/${f}`} alt={`Góndola ${i+1}`} className="w-full rounded-xl object-cover max-h-48" />
          ))}

          {item.vendedorAsignado && (
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-600">Vendedor responsable: {item.vendedorAsignado}</p>
            </div>
          )}
          {item.notas && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-500 mb-1">Nota del vendedor</p>
              <p className="text-xs text-gray-600">{item.notas}</p>
            </div>
          )}

          <p className="text-sm text-gray-600 leading-relaxed">{item.analisis.resumenGeneral}</p>

          <div className="grid grid-cols-2 gap-2">
            {item.analisis.criterios?.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-400 truncate">{c.nombre}</p>
                <p className={`text-sm font-bold mt-0.5 ${c.puntaje >= 8 ? 'text-green-600' : c.puntaje >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {c.puntaje}/10
                </p>
              </div>
            ))}
          </div>

          {item.analisis.skusFaltantes?.length > 0 && (
            <div className="bg-red-50 rounded-xl p-3 border border-red-100">
              <p className="text-xs font-semibold text-red-700 mb-1.5">SKUs faltantes</p>
              <ul className="space-y-1">
                {item.analisis.skusFaltantes.map((s, i) => (
                  <li key={i} className="text-xs text-red-600">• {s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-teal-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-teal-700 mb-1.5">Acciones prioritarias</p>
            <ul className="space-y-1">
              {item.analisis.accionesPrioritarias?.map((a, i) => (
                <li key={i} className="text-xs text-teal-600">• {a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function groupByFarmacia(items) {
  const groups = {};
  items.forEach(item => {
    const key = item.farmacia;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  // Dentro de cada farmacia: más reciente primero
  Object.values(groups).forEach(g => g.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
  // Farmacias ordenadas por visita más reciente primero
  return Object.fromEntries(
    Object.entries(groups).sort((a, b) => new Date(b[1][0].fecha) - new Date(a[1][0].fecha))
  );
}

export default function Historial({ userId, canDelete = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/historial/${userId}`)
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  const handleDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Cargando historial...</p>
    </div>
  );

  if (items.length === 0) return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <p className="text-gray-400 text-sm">No hay análisis registrados todavía.</p>
      <p className="text-gray-300 text-xs mt-1">Cargá tu primera visita en "Nueva Visita"</p>
    </div>
  );

  const groups = groupByFarmacia(items);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-5">
      <p className="text-xs text-gray-400 px-1">{items.length} análisis · {Object.keys(groups).length} farmacias</p>
      {Object.entries(groups).map(([farmacia, groupItems]) => (
        <div key={farmacia}>
          {/* Header de farmacia */}
          <div className="flex items-center gap-2 px-1 mb-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#0077B6' }} />
            <p className="text-sm font-semibold text-gray-700 truncate">{farmacia}</p>
            <span className="text-xs text-gray-400 flex-shrink-0">{groupItems.length} visita{groupItems.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-2 ml-4">
            {groupItems.map(item => (
              <AnalisisCard
                key={item.id}
                item={item}
                canDelete={canDelete}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
