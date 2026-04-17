import { TRAMOS, CREDITO_HIJO, APV_A_TOPE_UF, APV_A_CREDITO_PCT, UF_REF } from '../data/tramos'

export function calcularGlobal(base) {
  if (base <= 0) return 0
  for (const t of TRAMOS) {
    if (base <= t.limite) return Math.max(0, base * t.tasa - t.rebaja)
  }
  return 0
}

export function tramoInfo(base) {
  for (let i = 0; i < TRAMOS.length; i++) {
    if (base <= TRAMOS[i].limite) return { idx: i, tasa: TRAMOS[i].tasa, rebaja: TRAMOS[i].rebaja }
  }
  return { idx: 6, tasa: 0.35, rebaja: TRAMOS[6].rebaja }
}

export function calcularEscenario(datos, conAPV = false) {
  const {
    sueldo = 0, cotizaciones = 0, apv = 0, apvRegimen = 'B',
    intereses = 0, hijos = 0, arriendo = 0, dfl2 = false,
    ppm = 0, retenciones = 0, retiro = 0, otras = 0,
    creditoEmpresa = 0,
  } = datos

  let base = sueldo + retiro + otras - cotizaciones
  if (!dfl2) base += arriendo
  base -= intereses
  if (conAPV && apvRegimen === 'B') base -= apv
  base = Math.max(0, base)

  const impuestoBruto = calcularGlobal(base)

  let creditoAPV = 0
  if (conAPV && apvRegimen === 'A') {
    const topePesos = APV_A_TOPE_UF * UF_REF
    const apvEfectivo = Math.min(apv, topePesos)
    creditoAPV = apvEfectivo * APV_A_CREDITO_PCT
  }

  const creditoHijos = hijos * CREDITO_HIJO
  const impuestoNeto = Math.max(0, impuestoBruto - creditoHijos - creditoAPV - creditoEmpresa)
  const creditosTotales = ppm + retenciones
  const resultado = creditosTotales - impuestoNeto
  const tasaEfectiva = base > 0 ? (impuestoNeto / base) * 100 : 0

  return { base, impuestoBruto, creditoAPV, creditoHijos, creditoEmpresa, impuestoNeto, creditosTotales, resultado, tasaEfectiva }
}

// Calcula el APV óptimo para bajar un tramo marginal
export function optimizarAPV(datos) {
  const { apvRegimen = 'B' } = datos
  const sin = calcularEscenario(datos, false)
  const ti = tramoInfo(sin.base)

  const resultados = []

  if (ti.idx === 0) {
    return { posible: false, mensaje: 'Ya estás en el tramo exento (0%). No hay optimización posible.' }
  }

  // Calcular cuánto APV se necesita para bajar al tramo anterior
  const tramoObjetivo = TRAMOS[ti.idx - 1]
  const baseActual = sin.base
  const gap = baseActual - tramoObjetivo.limite

  if (apvRegimen === 'B') {
    const apvNecesario = Math.ceil(gap + 1)
    const datosConAPV = { ...datos, apv: apvNecesario }
    const con = calcularEscenario(datosConAPV, true)
    const ahorro = sin.impuestoNeto - con.impuestoNeto
    resultados.push({
      label: `Bajar al tramo ${(tramoObjetivo.tasa * 100).toFixed(0)}%`,
      apvNecesario,
      ahorro,
      tasaEfectiva: con.tasaEfectiva,
      roi: apvNecesario > 0 ? (ahorro / apvNecesario) * 100 : 0,
    })
  }

  if (apvRegimen === 'A') {
    // Régimen A: crédito directo 15% sobre el monto
    const apvPara15Pct = Math.min(Math.ceil(sin.impuestoNeto / APV_A_CREDITO_PCT), APV_A_TOPE_UF * UF_REF)
    const datosConAPV = { ...datos, apv: apvPara15Pct }
    const con = calcularEscenario(datosConAPV, true)
    const ahorro = sin.impuestoNeto - con.impuestoNeto
    resultados.push({
      label: `Crédito máximo 15% APV-A`,
      apvNecesario: apvPara15Pct,
      ahorro,
      tasaEfectiva: con.tasaEfectiva,
      roi: apvPara15Pct > 0 ? (ahorro / apvPara15Pct) * 100 : 0,
    })
  }

  // Escenarios intermedios 25%, 50%, 75%, 100% del gap
  const pcts = [0.25, 0.5, 0.75, 1.0]
  for (const p of pcts) {
    const monto = Math.ceil(gap * p)
    if (monto <= 0) continue
    const datosConAPV = { ...datos, apv: monto }
    const con = calcularEscenario(datosConAPV, true)
    const ahorro = sin.impuestoNeto - con.impuestoNeto
    resultados.push({
      label: `${(p * 100).toFixed(0)}% del gap al tramo anterior`,
      apvNecesario: monto,
      ahorro,
      tasaEfectiva: con.tasaEfectiva,
      roi: monto > 0 ? (ahorro / monto) * 100 : 0,
    })
  }

  return {
    posible: true,
    tramoActual: ti,
    tramoObjetivo,
    gap,
    resultados,
    sinPlan: sin,
  }
}

export function fmt(n) {
  if (n == null || isNaN(n)) return '$0'
  return '$' + Math.round(n).toLocaleString('es-CL')
}

export function fmtPct(n) {
  return (n || 0).toFixed(1) + '%'
}
