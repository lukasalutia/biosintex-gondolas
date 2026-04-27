import { useState, useEffect, useRef } from 'react';

function ScoreCircle({ score }) {
  const color = score >= 8 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-600';
  const bg = score >= 8 ? 'bg-green-50' : score >= 5 ? 'bg-yellow-50' : 'bg-red-50';
  const ring = score >= 8 ? 'ring-green-200' : score >= 5 ? 'ring-yellow-200' : 'ring-red-200';
  return (
    <div className={`w-20 h-20 rounded-full ${bg} ring-4 ${ring} flex flex-col items-center justify-center flex-shrink-0`}>
      <span className={`text-2xl font-bold ${color}`}>{score}</span>
      <span className="text-xs text-gray-400">/10</span>
    </div>
  );
}

function TipoBadge({ tipo, label }) {
  const styles = {
    otc: 'bg-blue-100 text-blue-700',
    cosmetica: 'bg-pink-100 text-pink-700',
    mixta: 'bg-purple-100 text-purple-700',
    A: 'bg-emerald-100 text-emerald-700',
    B: 'bg-amber-100 text-amber-700',
    C: 'bg-orange-100 text-orange-700',
  };
  const labels = {
    otc: 'OTC',
    cosmetica: 'Cosmética',
    mixta: 'Mixta',
    A: 'Tienda A',
    B: 'Tienda B',
    C: 'Tienda C',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[tipo] || 'bg-gray-100 text-gray-600'}`}>
      {label || labels[tipo] || tipo}
    </span>
  );
}

function CriterioCard({ criterio }) {
  const [expanded, setExpanded] = useState(false);
  const { puntaje } = criterio;
  const badgeColor = puntaje >= 8 ? 'bg-green-100 text-green-700' : puntaje >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-800 text-sm">{criterio.nombre}</span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>{puntaje}/10</span>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-teal-600 mt-2 hover:text-teal-700"
      >
        {expanded ? 'Ver menos ▲' : 'Ver detalle ▼'}
      </button>
      {expanded && (
        <div className="mt-3 space-y-2 text-xs text-gray-600">
          <p><span className="font-medium text-gray-700">Observación: </span>{criterio.observacion}</p>
          <div className="bg-teal-50 p-2.5 rounded-lg">
            <span className="font-medium text-teal-700">💡 Recomendación: </span>{criterio.recomendacion}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductosTable({ productos }) {
  if (!productos || productos.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <p className="font-semibold text-gray-900 text-sm">Productos detectados</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2.5 text-gray-500 font-medium">SKU</th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium">Frentes</th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium">Mínimo</th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium">Zona</th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => {
              const cumple = p.cumple ?? (p.frentesVisibles >= p.frentesMinimos);
              const zonaLabels = { oro: '🥇 Oro', plata: '🥈 Plata', bronce: '🥉 Bronce', cabeza: '⬆️ Alta', desconocida: '?' };
              const clasifColor = p.clasificacion === 'Héroe' ? 'text-blue-600' : p.clasificacion === 'Infaltable' ? 'text-teal-600' : 'text-gray-500';
              return (
                <tr key={i} className="border-t border-gray-50">
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-gray-800">{p.sku}</p>
                    <p className={`text-xs mt-0.5 ${clasifColor}`}>{p.clasificacion}</p>
                  </td>
                  <td className="text-center px-3 py-2.5 font-bold text-gray-700">{p.frentesVisibles}</td>
                  <td className="text-center px-3 py-2.5 text-gray-400">{p.frentesMinimos}</td>
                  <td className="text-center px-3 py-2.5 text-gray-500">{zonaLabels[p.zona] || p.zona}</td>
                  <td className="text-center px-3 py-2.5">
                    {cumple
                      ? <span className="text-green-600 font-semibold">✓</span>
                      : <span className="text-red-500 font-semibold">✗</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SkusFaltantes({ skus }) {
  if (!skus || skus.length === 0) return null;
  return (
    <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
      <p className="text-sm font-semibold text-red-700 mb-2">⚠️ SKUs faltantes o sin stock mínimo</p>
      <ul className="space-y-1">
        {skus.map((s, i) => (
          <li key={i} className="text-xs text-red-600">• {s}</li>
        ))}
      </ul>
    </div>
  );
}

const MAX_FOTOS = 5;
const todayStr = () => new Date().toISOString().split('T')[0];

export default function NuevaVisita({ user }) {
  const [farmacia, setFarmacia] = useState('');
  const [tipoTienda, setTipoTienda] = useState('');
  const [notas, setNotas] = useState('');
  const [fecha, setFecha] = useState(todayStr);
  const [fotos, setFotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [vendedores, setVendedores] = useState([]);
  const [vendedorAsignado, setVendedorAsignado] = useState('');
  const fileRef = useRef();

  const esGerente = user.puesto === 'Gerente';

  useEffect(() => {
    if (esGerente) {
      fetch('/api/vendedores')
        .then(r => r.json())
        .then(data => setVendedores(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [esGerente]);

  const handleFotos = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const nuevas = [...fotos, ...files].slice(0, MAX_FOTOS);
    // Revocar solo las URLs de las fotos que se reemplazan (las que no están en nuevas)
    previews.slice(nuevas.length).forEach(url => URL.revokeObjectURL(url));
    setFotos(nuevas);
    setPreviews(prev => [
      ...prev.slice(0, fotos.length), // URLs existentes que se conservan
      ...nuevas.slice(fotos.length).map(f => URL.createObjectURL(f)), // solo las nuevas
    ]);
    setResultado(null);
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeFoto = (idx) => {
    URL.revokeObjectURL(previews[idx]);
    setFotos(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!farmacia.trim() || fotos.length === 0) return;
    setLoading(true);
    setError('');
    setResultado(null);

    const formData = new FormData();
    fotos.forEach(f => formData.append('fotos', f));
    formData.append('farmacia', farmacia.trim());
    formData.append('userId', user.id);
    formData.append('userName', user.nombre);
    if (tipoTienda) formData.append('tipoTiendaDeclarado', tipoTienda);
    if (notas.trim()) formData.append('notas', notas.trim());
    if (vendedorAsignado) formData.append('vendedorAsignado', vendedorAsignado);
    formData.append('fecha', fecha);

    try {
      const res = await fetch('/api/analisis', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultado(data);
      setFarmacia('');
      setTipoTienda('');
      setNotas('');
      setFecha(todayStr());
      setFotos([]);
      setPreviews([]);
      setVendedorAsignado('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4">Nueva Visita</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {esGerente && vendedores.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vendedor responsable <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <select
                value={vendedorAsignado}
                onChange={e => setVendedorAsignado(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="">— Carga propia ({user.nombre}) —</option>
                {vendedores.filter(v => v.id !== user.id).map(v => (
                  <option key={v.id} value={v.nombre}>{v.nombre}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Farmacia</label>
            <input
              type="text"
              value={farmacia}
              onChange={e => setFarmacia(e.target.value)}
              placeholder="Ej: Farmacia del Centro"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de visita</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              max={todayStr()}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de farmacia <span className="text-gray-400 font-normal">(opcional)</span></label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'A', label: 'Tienda A', desc: 'Cadena / alto volumen' },
                { id: 'B', label: 'Tienda B', desc: 'Mediana / independiente' },
                { id: 'C', label: 'Tienda C', desc: 'Pequeña / barrio' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTipoTienda(tipoTienda === t.id ? '' : t.id)}
                  className={`py-2.5 px-2 rounded-xl border-2 text-center transition-all ${
                    tipoTienda === t.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-semibold text-sm ${tipoTienda === t.id ? 'text-teal-700' : 'text-gray-700'}`}>{t.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{t.desc}</p>
                </button>
              ))}
            </div>
            {tipoTienda && (
              <p className="text-xs text-teal-600 mt-1.5 px-1">
                El modelo aplicará los frentes mínimos de Tienda {tipoTienda}.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas adicionales <span className="text-gray-400 font-normal">(opcional)</span></label>
            <textarea
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Ej: la farmacia estaba de reforma, faltaba stock por pedido pendiente, es cliente nuevo..."
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Fotos de la góndola <span className="text-gray-400 font-normal">({fotos.length}/{MAX_FOTOS})</span>
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {previews.map((p, i) => (
                  <div key={i} className="relative">
                    <img src={p} alt={`Foto ${i+1}`} className="w-full h-24 object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => removeFoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
                    >×</button>
                    {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded-md">Principal</span>}
                  </div>
                ))}
              </div>
            )}

            {fotos.length < MAX_FOTOS && (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-teal-400 hover:bg-teal-50 rounded-xl p-4 text-center cursor-pointer transition-colors"
              >
                <svg className="w-8 h-8 text-gray-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm text-gray-400">{fotos.length === 0 ? 'Tocá para subir fotos' : 'Agregar otra foto'}</p>
                <p className="text-xs text-gray-300 mt-0.5">Hasta {MAX_FOTOS} fotos · JPG, PNG, WebP · 30MB c/u</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFotos} className="hidden" />
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>}

          <button
            type="submit"
            disabled={!farmacia.trim() || fotos.length === 0 || loading}
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analizando con IA... (~15 seg)
              </>
            ) : 'Analizar Góndola'}
          </button>
        </form>
      </div>

      {resultado && (
        <div className="space-y-3">
          {/* Header con score y tipo de góndola */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-4">
              <ScoreCircle score={resultado.analisis.puntajeTotal} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900">{resultado.farmacia}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(resultado.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {resultado.analisis.tipoGondola && (
                    <TipoBadge tipo={resultado.analisis.tipoGondola} />
                  )}
                  {resultado.analisis.tipoTienda && (
                    <TipoBadge tipo={resultado.analisis.tipoTienda} />
                  )}
                </div>
                {resultado.analisis.razonTipoTienda && (
                  <p className="text-xs text-gray-400 mt-1.5 italic">{resultado.analisis.razonTipoTienda}</p>
                )}
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{resultado.analisis.resumenGeneral}</p>
              </div>
            </div>
          </div>

          {/* Productos detectados */}
          <ProductosTable productos={resultado.analisis.productosDetectados} />

          {/* SKUs faltantes */}
          <SkusFaltantes skus={resultado.analisis.skusFaltantes} />

          {/* Criterios */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-2">Criterios evaluados</p>
            <div className="space-y-2">
              {resultado.analisis.criterios?.map((c, i) => (
                <CriterioCard key={i} criterio={c} />
              ))}
            </div>
          </div>

          {/* Acciones prioritarias */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h4 className="font-semibold text-gray-900 mb-3">🎯 Acciones Prioritarias</h4>
            <ol className="space-y-2.5">
              {resultado.analisis.accionesPrioritarias?.map((a, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {a}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
