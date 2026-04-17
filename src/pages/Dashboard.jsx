import { useState } from 'react'
import { useClientes } from '../hooks/useClientes'
import { calcularEscenario, fmt, fmtPct, tramoInfo } from '../utils/calculos'
import { exportarCarteraExcel } from '../utils/excel'
import { generarPDF } from '../utils/pdf'
import { Download, FileText, Trash2, Search, Users } from 'lucide-react'

export default function Dashboard() {
  const { clientes, eliminar, buscar } = useClientes()
  const [q, setQ] = useState('')
  const [confirmEliminar, setConfirmEliminar] = useState(null)

  const lista = buscar(q)

  const totalAhorro = lista.reduce((acc, c) => {
    const sin = calcularEscenario(c, false)
    const con = calcularEscenario(c, true)
    return acc + (sin.impuestoNeto - con.impuestoNeto)
  }, 0)

  const conDevolucion = lista.filter(c => calcularEscenario(c, true).resultado >= 0).length

  const handleEliminar = (rut) => {
    eliminar(rut)
    setConfirmEliminar(null)
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem 1rem' }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '26px', marginBottom: '4px' }}>Cartera de clientes</h1>
          <p style={{ fontSize: '13px', color: 'var(--c-text-3)' }}>{clientes.length} clientes registrados</p>
        </div>
        <button onClick={() => exportarCarteraExcel(clientes)} disabled={!clientes.length}>
          <Download size={14} />Excel completo
        </button>
      </div>

      {/* KPIs cartera */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="metric">
          <div className="m-label">Total clientes</div>
          <div className="m-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} />{clientes.length}
          </div>
        </div>
        <div className="metric green">
          <div className="m-label">Ahorro total cartera</div>
          <div className="m-value">{fmt(totalAhorro)}</div>
        </div>
        <div className="metric green">
          <div className="m-label">Con devolución</div>
          <div className="m-value">{conDevolucion}</div>
          <div className="m-sub">{lista.length - conDevolucion} con pago</div>
        </div>
        <div className="metric blue">
          <div className="m-label">Resultados filtrados</div>
          <div className="m-value">{lista.length}</div>
        </div>
      </div>

      {/* Buscador */}
      <div className="field" style={{ marginBottom: '1rem', maxWidth: '320px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)' }} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por nombre o RUT..."
            style={{ paddingLeft: '32px' }}
          />
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--c-text-3)' }}>
          <Users size={32} style={{ marginBottom: '12px', opacity: .4 }} />
          <p style={{ fontSize: '14px' }}>{q ? 'Sin resultados para la búsqueda.' : 'No hay clientes guardados aún.'}</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>Usa el Simulador para agregar clientes.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <div className="scroll-x">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>RUT</th>
                  <th>APV</th>
                  <th>Base imponible</th>
                  <th>Tramo</th>
                  <th>Ahorro</th>
                  <th>Tasa ef.</th>
                  <th>Resultado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lista.map((c, i) => {
                  const sin = calcularEscenario(c, false)
                  const con = calcularEscenario(c, true)
                  const ti = tramoInfo(con.base)
                  const ahorro = sin.impuestoNeto - con.impuestoNeto
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: '500' }}>{c.nombre}</td>
                      <td style={{ color: 'var(--c-text-2)', fontSize: '12px' }}>{c.rut || '—'}</td>
                      <td><span className={`badge badge-${c.apvRegimen === 'A' ? 'green' : 'blue'}`}>APV-{c.apvRegimen || 'B'}</span></td>
                      <td>{fmt(con.base)}</td>
                      <td><span className="badge badge-gray">{(ti.tasa * 100).toFixed(0)}%</span></td>
                      <td style={{ color: 'var(--c-accent)', fontWeight: '500' }}>{fmt(ahorro)}</td>
                      <td>{fmtPct(con.tasaEfectiva)}</td>
                      <td>
                        <span className={`badge badge-${con.resultado >= 0 ? 'green' : 'red'}`}>
                          {con.resultado >= 0 ? 'Dev.' : 'Pago'} {fmt(Math.abs(con.resultado))}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn-ghost" style={{ padding: '4px 8px' }} onClick={() => generarPDF(c)} title="PDF">
                            <FileText size={13} />
                          </button>
                          {confirmEliminar === c.rut ? (
                            <button className="btn-danger" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => handleEliminar(c.rut)}>
                              Confirmar
                            </button>
                          ) : (
                            <button className="btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setConfirmEliminar(c.rut)} title="Eliminar">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
