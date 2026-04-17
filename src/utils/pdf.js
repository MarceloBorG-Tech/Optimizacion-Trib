import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { calcularEscenario, fmt, fmtPct, tramoInfo } from './calculos'
import { AÑO_TRIBUTARIO } from '../data/tramos'

export function generarPDF(datos) {
  const sin = calcularEscenario(datos, false)
  const con = calcularEscenario(datos, true)
  const ahorro = sin.impuestoNeto - con.impuestoNeto
  const ti = tramoInfo(con.base)
  const nombre = datos.nombre || 'Cliente'
  const rut = datos.rut || '—'
  const hoy = new Date().toLocaleDateString('es-CL')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210

  // Header
  doc.setFillColor(20, 30, 20)
  doc.rect(0, 0, W, 38, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('TributarioCL', 16, 17)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 200, 160)
  doc.text(`Informe de Optimización Tributaria — AT${AÑO_TRIBUTARIO}`, 16, 26)
  doc.setTextColor(200, 200, 200)
  doc.text(`Generado: ${hoy}`, 16, 33)

  // Badge confidencial
  doc.setFillColor(45, 138, 87)
  doc.roundedRect(W - 50, 13, 36, 8, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text('CONFIDENCIAL', W - 43, 18.5)

  // Datos cliente
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(nombre, 16, 52)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`RUT: ${rut}   |   APV Régimen ${datos.apvRegimen || 'B'}   |   Tramo marginal: ${(ti.tasa * 100).toFixed(0)}%`, 16, 59)

  // Métricas resumen
  const metricas = [
    { l: 'Base imponible', v: fmt(con.base) },
    { l: 'Ahorro logrado', v: fmt(Math.abs(ahorro)), color: [15, 110, 56] },
    { l: 'Tasa efectiva', v: fmtPct(con.tasaEfectiva), color: [26, 61, 107] },
    { l: con.resultado >= 0 ? 'Devolución' : 'Pago', v: fmt(Math.abs(con.resultado)), color: con.resultado >= 0 ? [15, 110, 56] : [139, 32, 32] },
  ]
  const cardW = (W - 32 - 12) / 4
  metricas.forEach((m, i) => {
    const x = 16 + i * (cardW + 4)
    doc.setFillColor(246, 245, 241)
    doc.roundedRect(x, 66, cardW, 22, 2, 2, 'F')
    doc.setFontSize(8)
    doc.setTextColor(130, 130, 130)
    doc.setFont('helvetica', 'normal')
    doc.text(m.l, x + 4, 73)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    if (m.color) doc.setTextColor(...m.color)
    else doc.setTextColor(30, 30, 30)
    doc.text(m.v, x + 4, 82)
  })

  // Tabla comparativa
  doc.setFontSize(9)
  doc.setTextColor(130, 130, 130)
  doc.setFont('helvetica', 'normal')
  doc.text('COMPARATIVA SIN / CON PLAN DE OPTIMIZACIÓN', 16, 98)

  doc.autoTable({
    startY: 101,
    margin: { left: 16, right: 16 },
    head: [['Concepto', 'Sin plan', 'Con plan', 'Diferencia']],
    body: [
      ['Base imponible', fmt(sin.base), fmt(con.base), fmt(Math.abs(con.base - sin.base))],
      ['Impuesto bruto calculado', fmt(sin.impuestoBruto), fmt(con.impuestoBruto), '—'],
      [`Crédito APV-${datos.apvRegimen || 'B'}`, '$0', fmt(con.creditoAPV), fmt(con.creditoAPV)],
      ['Crédito por hijos', fmt(sin.creditoHijos), fmt(con.creditoHijos), '—'],
      ['Crédito por empresas', fmt(sin.creditoEmpresa), fmt(con.creditoEmpresa), '—'],
      ['Impuesto neto', fmt(sin.impuestoNeto), fmt(con.impuestoNeto), fmt(ahorro)],
      ['Créditos PPM + retenciones', fmt(sin.creditosTotales), fmt(con.creditosTotales), '—'],
      [con.resultado >= 0 ? 'Devolución' : 'Pago final', fmt(Math.abs(sin.resultado)), fmt(Math.abs(con.resultado)), '—'],
    ],
    styles: { fontSize: 9, cellPadding: 3, textColor: [30, 30, 30] },
    headStyles: { fillColor: [20, 30, 20], textColor: [200, 230, 200], fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [250, 249, 245] },
    columnStyles: { 0: { fontStyle: 'bold' }, 3: { textColor: [15, 110, 56], fontStyle: 'bold' } },
  })

  // Footer
  const finalY = doc.lastAutoTable.finalY + 12
  doc.setFillColor(246, 245, 241)
  doc.rect(0, finalY, W, 20, 'F')
  doc.setFontSize(7.5)
  doc.setTextColor(140, 140, 140)
  doc.text('Esta simulación tiene fines informativos. Los valores definitivos dependen de la declaración en sii.cl.', 16, finalY + 8)
  doc.text('Consulte siempre con un asesor tributario habilitado.', 16, finalY + 14)

  doc.save(`Informe_${nombre.replace(/ /g, '_')}_AT${AÑO_TRIBUTARIO}.pdf`)
}
