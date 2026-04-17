import * as XLSX from 'xlsx'
import { calcularEscenario, tramoInfo } from './calculos'
import { AÑO_TRIBUTARIO } from '../data/tramos'

export function exportarCarteraExcel(clientes) {
  if (!clientes.length) return

  const filas = clientes.map((c) => {
    const sin = calcularEscenario(c, false)
    const con = calcularEscenario(c, true)
    const ti = tramoInfo(con.base)
    const ahorro = sin.impuestoNeto - con.impuestoNeto
    return {
      Nombre: c.nombre || '',
      RUT: c.rut || '',
      'APV Régimen': c.apvRegimen || 'B',
      'Sueldo/Ingresos': c.sueldo || 0,
      Cotizaciones: c.cotizaciones || 0,
      'APV ($)': c.apv || 0,
      'Arriendo': c.arriendo || 0,
      'PPM': c.ppm || 0,
      'Retenciones': c.retenciones || 0,
      'Base imponible': Math.round(con.base),
      'Tramo marginal (%)': (ti.tasa * 100).toFixed(0) + '%',
      'Impuesto sin plan': Math.round(sin.impuestoNeto),
      'Impuesto con plan': Math.round(con.impuestoNeto),
      'Ahorro tributario': Math.round(ahorro),
      'Tasa efectiva (%)': con.tasaEfectiva.toFixed(1) + '%',
      'Resultado final': Math.round(con.resultado),
      'Dev/Pago': con.resultado >= 0 ? 'Devolución' : 'Pago',
    }
  })

  const ws = XLSX.utils.json_to_sheet(filas)

  // Anchos de columna
  ws['!cols'] = [
    { wch: 22 }, { wch: 14 }, { wch: 12 }, { wch: 16 }, { wch: 14 },
    { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 16 },
    { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 16 },
    { wch: 16 }, { wch: 12 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `Cartera AT${AÑO_TRIBUTARIO}`)

  // Hoja resumen
  const resumen = [
    ['Resumen cartera', `AT${AÑO_TRIBUTARIO}`],
    ['Total clientes', clientes.length],
    ['Total ahorro cartera', filas.reduce((a, f) => a + Number(f['Ahorro tributario']), 0)],
    ['Clientes con devolución', filas.filter(f => f['Dev/Pago'] === 'Devolución').length],
    ['Clientes con pago', filas.filter(f => f['Dev/Pago'] === 'Pago').length],
  ]
  const wsR = XLSX.utils.aoa_to_sheet(resumen)
  XLSX.utils.book_append_sheet(wb, wsR, 'Resumen')

  XLSX.writeFile(wb, `Cartera_Tributaria_AT${AÑO_TRIBUTARIO}.xlsx`)
}
