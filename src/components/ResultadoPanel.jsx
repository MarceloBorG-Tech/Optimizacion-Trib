import { calcularEscenario, fmt, fmtPct, tramoInfo } from '../utils/calculos'
import { TRAMOS } from '../data/tramos'

export default function ResultadoPanel({ datos }) {
  const sin = calcularEscenario(datos, false)
  const con = calcularEscenario(datos, true)
  const ahorro = sin.impuestoNeto - con.impuestoNeto
  const ti = tramoInfo(con.base)
  const maxBase = TRAMOS[TRAMOS.length - 2].limite
  const barPct = Math.min(100, (con.base / maxBase) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Métricas */}
      <div className="grid-4">
        <div className="metric">
          <div className="m-label">Base imponible</div>
          <div className="m-value">{fmt(con.base)}</div>
          <div className="m-sub">Con optimización</div>
        </div>
        <div className={`metric ${ahorro > 0 ? 'green' : ''}`}>
          <div className="m-label">Ahorro tributario</div>
          <div className="m-value">{fmt(Math.abs(ahorro))}</div>
          <div className="m-sub">{ahorro >= 0 ? 'Rebaja de impuesto' : 'Aumento'}</div>
        </div>
        <div className="metric blue">
          <div className="m-label">Tasa efectiva</div>
          <div className="m-value">{fmtPct(con.tasaEfectiva)}</div>
          <div className="m-sub">Régimen APV-{datos.apvRegimen || 'B'}</div>
        </div>
        <div className={`metric ${con.resultado >= 0 ? 'green' : 'red'}`}>
          <div className="m-label">{con.resultado >= 0 ? 'Devolución' : 'A pagar'}</div>
          <div className="m-value">{fmt(Math.abs(con.resultado))}</div>
          <div className="m-sub">Resultado final</div>
        </div>
      </div>

      {/* Barra tramo */}
      <div className="card">
        <div className="section-label">Tramo Global Complementario</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ flex: 1, height: '8px', background: 'var(--c-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: barPct + '%', background: 'var(--c-accent-mid)', borderRadius: '4px', transition: 'width .4s' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--c-accent)', minWidth: '60px' }}>
            {(ti.tasa * 100).toFixed(0)}% marginal
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--c-text-3)' }}>
          <span>0%</span><span>4%</span><span>8%</span><span>13.5%</span><span>23%</span><span>30.4%</span><span>35%</span>
        </div>
      </div>

      {/* Tabla comparativa */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[
          { label: 'Sin plan', data: sin, highlighted: false },
          { label: 'Con plan APV-' + (datos.apvRegimen || 'B'), data: con, highlighted: true },
        ].map(({ label, data, highlighted }) => (
          <div key={label} className="card" style={highlighted ? { border: '2px solid var(--c-accent-mid)' } : {}}>
            <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {label}
              {highlighted && <span className="badge badge-green">Optimizado</span>}
            </div>
            {[
              ['Base imponible', fmt(data.base)],
              ['Impuesto bruto', fmt(data.impuestoBruto)],
              [`Crédito APV-${datos.apvRegimen || 'B'}`, '- ' + fmt(data.creditoAPV)],
              ['Crédito hijos', '- ' + fmt(data.creditoHijos)],
              ['Crédito empresas', '- ' + fmt(data.creditoEmpresa)],
              ['Impuesto neto', fmt(data.impuestoNeto)],
              ['PPM + retenciones', '- ' + fmt(data.creditosTotales)],
              [data.resultado >= 0 ? 'Devolución' : 'Pago', fmt(Math.abs(data.resultado))],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '5px 0', borderBottom: '1px solid var(--c-border)' }}>
                <span style={{ color: 'var(--c-text-2)' }}>{k}</span>
                <span style={{ fontWeight: '500' }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
