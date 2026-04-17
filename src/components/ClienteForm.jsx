import { useState } from 'react'
import { formatearRut, validarRut } from '../utils/rut'

const CAMPOS_NUM = [
  { id: 'sueldo',         label: 'Sueldos y honorarios anuales ($)' },
  { id: 'retiro',         label: 'Retiros / dividendos de empresas ($)' },
  { id: 'arriendo',       label: 'Rentas de arriendo anuales ($)' },
  { id: 'otras',          label: 'Otras rentas ($)' },
  { id: 'cotizaciones',   label: 'Cotizaciones previsionales ($)' },
  { id: 'intereses',      label: 'Intereses crédito hipotecario ($)' },
  { id: 'apv',            label: 'Monto APV ($)' },
  { id: 'creditoEmpresa', label: 'Crédito integración empresas ($)' },
  { id: 'ppm',            label: 'PPM pagados ($)' },
  { id: 'retenciones',    label: 'Retenciones honorarios ($)' },
  { id: 'hijos',          label: 'Hijos con crédito educación' },
]

export default function ClienteForm({ datos, onChange }) {
  const [rutError, setRutError] = useState(false)

  const set = (campo, valor) => onChange({ ...datos, [campo]: valor })

  const handleRut = (e) => {
    const formateado = formatearRut(e.target.value)
    set('rut', formateado)
    setRutError(formateado && !validarRut(formateado))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Identificación */}
      <section>
        <div className="section-label">Identificación del cliente</div>
        <div className="grid-2">
          <div className="field">
            <label>Nombre completo</label>
            <input value={datos.nombre || ''} onChange={e => set('nombre', e.target.value)} placeholder="Juan Pérez González" />
          </div>
          <div className="field">
            <label>RUT</label>
            <input
              value={datos.rut || ''}
              onChange={handleRut}
              placeholder="12.345.678-9"
              style={rutError ? { borderColor: 'var(--c-danger)' } : {}}
            />
            {rutError && <span style={{ fontSize: '11px', color: 'var(--c-danger)' }}>RUT inválido</span>}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Ingresos */}
      <section>
        <div className="section-label">Ingresos del año tributario</div>
        <div className="grid-2">
          {['sueldo','retiro','arriendo','otras'].map(id => (
            <div className="field" key={id}>
              <label>{CAMPOS_NUM.find(c => c.id === id)?.label}</label>
              <input type="number" min="0" value={datos[id] || 0} onChange={e => set(id, +e.target.value)} />
            </div>
          ))}
        </div>
        <div className="toggle-row">
          <label className="toggle">
            <input type="checkbox" checked={!!datos.dfl2} onChange={e => set('dfl2', e.target.checked)} />
            <span className="toggle-sw" />
          </label>
          <label>Arriendo exento bajo DFL-2 (no tributa en Global Complementario)</label>
        </div>
      </section>

      <hr className="divider" />

      {/* Deducciones */}
      <section>
        <div className="section-label">Deducciones legales</div>
        <div className="grid-2">
          {['cotizaciones','intereses'].map(id => (
            <div className="field" key={id}>
              <label>{CAMPOS_NUM.find(c => c.id === id)?.label}</label>
              <input type="number" min="0" value={datos[id] || 0} onChange={e => set(id, +e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* APV */}
      <section>
        <div className="section-label">APV — Ahorro Previsional Voluntario</div>
        <div className="field" style={{ marginBottom: '12px' }}>
          <label>Monto APV ($)</label>
          <input type="number" min="0" value={datos.apv || 0} onChange={e => set('apv', +e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {['A','B'].map(r => (
            <div
              key={r}
              onClick={() => set('apvRegimen', r)}
              style={{
                padding: '12px',
                border: datos.apvRegimen === r ? '2px solid var(--c-accent-mid)' : '1px solid var(--c-border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                background: datos.apvRegimen === r ? 'var(--c-accent-light)' : 'var(--c-surface)',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '3px' }}>Régimen {r}</div>
              <div style={{ fontSize: '11px', color: 'var(--c-text-2)' }}>
                {r === 'A' ? 'Crédito 15% directo al impuesto (tope UF 600/año)' : 'Descuenta la base imponible (mayor efecto en tramos altos)'}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Créditos */}
      <section>
        <div className="section-label">Créditos y retenciones</div>
        <div className="grid-3">
          {['ppm','retenciones','hijos','creditoEmpresa'].map(id => (
            <div className="field" key={id}>
              <label>{CAMPOS_NUM.find(c => c.id === id)?.label}</label>
              <input type="number" min="0" value={datos[id] || 0} onChange={e => set(id, +e.target.value)} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
