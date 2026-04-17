// Tramos Global Complementario AT2025
// Actualizar cada año tributario
export const AÑO_TRIBUTARIO = 2025

export const TRAMOS = [
  { limite: 8_800_000,  tasa: 0,     rebaja: 0 },
  { limite: 19_600_000, tasa: 0.04,  rebaja: 355_000 },
  { limite: 32_700_000, tasa: 0.08,  rebaja: 1_140_000 },
  { limite: 45_800_000, tasa: 0.135, rebaja: 2_940_000 },
  { limite: 58_900_000, tasa: 0.23,  rebaja: 6_890_000 },
  { limite: 78_500_000, tasa: 0.304, rebaja: 11_800_000 },
  { limite: Infinity,   tasa: 0.35,  rebaja: 15_400_000 },
]

export const CREDITO_HIJO      = 70_000      // por hijo con crédito educación
export const APV_A_TOPE_UF    = 600         // tope anual APV régimen A en UF
export const APV_A_CREDITO_PCT = 0.15       // 15% crédito directo al impuesto
export const UF_REF            = 38_000     // valor UF referencial (actualizar)

// Vencimientos clave AT2025
export const CALENDARIO = [
  { fecha: '2025-03-31', tipo: 'warn',    titulo: 'Inicio operación Renta',     desc: 'Apertura del servicio de declaraciones en sii.cl' },
  { fecha: '2025-04-03', tipo: 'default', titulo: 'F22 segmento A',              desc: 'Primer vencimiento para contribuyentes sin derecho a devolución' },
  { fecha: '2025-04-11', tipo: 'danger',  titulo: 'F22 con pago (todos)',         desc: 'Vencimiento final para contribuyentes con impuesto a pagar' },
  { fecha: '2025-04-30', tipo: 'success', titulo: 'F22 con devolución',           desc: 'Vencimiento para contribuyentes con devolución de impuestos' },
  { fecha: '2025-05-31', tipo: 'default', titulo: 'PPM mayo',                     desc: 'Pago Provisional Mensual correspondiente a abril' },
  { fecha: '2025-06-30', tipo: 'default', titulo: 'PPM junio',                    desc: 'Pago Provisional Mensual correspondiente a mayo' },
  { fecha: '2025-07-31', tipo: 'default', titulo: 'PPM julio',                    desc: 'Pago Provisional Mensual correspondiente a junio' },
  { fecha: '2025-08-29', tipo: 'default', titulo: 'PPM agosto',                   desc: 'Pago Provisional Mensual correspondiente a julio' },
  { fecha: '2025-09-30', tipo: 'default', titulo: 'PPM septiembre',               desc: 'Pago Provisional Mensual correspondiente a agosto' },
  { fecha: '2025-10-31', tipo: 'default', titulo: 'PPM octubre',                  desc: 'Pago Provisional Mensual correspondiente a septiembre' },
  { fecha: '2025-11-28', tipo: 'default', titulo: 'PPM noviembre',                desc: 'Pago Provisional Mensual correspondiente a octubre' },
  { fecha: '2025-12-31', tipo: 'default', titulo: 'PPM diciembre',                desc: 'Pago Provisional Mensual correspondiente a noviembre' },
  { fecha: '2026-01-31', tipo: 'warn',    titulo: 'PPM enero + cierre año',       desc: 'PPM de diciembre y resumen anual de honorarios' },
  { fecha: '2026-02-28', tipo: 'warn',    titulo: 'Certificados de renta',        desc: 'Emisión de certificados anuales por empleadores y pagadores' },
]
