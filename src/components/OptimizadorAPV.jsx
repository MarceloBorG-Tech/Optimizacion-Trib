import { optimizarAPV, fmt, fmtPct } from '../utils/calculos'
import { TrendingDown, AlertCircle } from 'lucide-react'

export default function OptimizadorAPV({ datos }) {
  const resultado = optimizarAPV(datos)

  if (!resultado.posible) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertCircle size={16} style={{ color: 'var(--c-text-3)' }} />
        <span style={{ fontSize: '13px', color: 'var(--c-text-2)' }}>{resultado.mensaje}</span>
      </div>
    )
  }

  const { tramoActual, tramoObjetivo, gap, resultados } = resultado

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="card" style={{ background: 'var(--c-accent-light)', border: '1px solid var(--c-accent-mid)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <TrendingDown size={16} style={{ color: 'var(--c-accent)' }} />
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--c-accent)' }}>
            Optimizador automático APV-{datos.apvRegimen || 'B'}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--c-text-2)' }}>
          Tramo actual: <strong>{(tramoActual.tasa * 100).toFixed(0)}%</strong> marginal.
          Aportando <strong>{fmt(gap)}</strong> en APV puedes bajar al tramo del <strong>{(tramoObjetivo.tasa * 100).toFixed(0)}%</strong>.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {resultados.slice(0, 4).map((r, i) => (
          <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500' }}>{r.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--c-text-3)', marginTop: '2px' }}>
                Aportar {fmt(r.apvNecesario)} → tasa efectiva {fmtPct(r.tasaEfectiva)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontFamily: "'DM Serif Display', serif", color: 'var(--c-accent)' }}>
                {fmt(r.ahorro)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--c-text-3)' }}>ahorro fiscal</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
