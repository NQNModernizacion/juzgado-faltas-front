/**
 * Esta función formatea una cadena de fecha desde el formato 'DD/MM/YYYY' a 'YYYY/MM/DD'.
 *
 * @param {string} fechaOriginal - La cadena de fecha original en el formato 'DD/MM/YYYY'.
 * @returns {string} - La cadena de fecha formateada en el formato 'YYYY/MM/DD'.
 */
export const formatoFecha = (fechaOriginal: string): string => {
  let partesFecha
  if (fechaOriginal.includes('/')) {
    partesFecha = fechaOriginal.split('/')
  } else if (fechaOriginal.includes('-')) {
    partesFecha = fechaOriginal.split('-')
  } else {
    throw new Error(
      'Formato de fecha no reconocido. Debe contener "/" o "-" como separadores.'
    )
  }

  if (partesFecha.length === 3) {
    const nuevaFecha =
      partesFecha[2] + '/' + partesFecha[1] + '/' + partesFecha[0]
    return nuevaFecha
  } else {
    throw new Error(
      'Formato de fecha inválido. La fecha debe tener el formato "DD/MM/YYYY" o "DD-MM-YYYY".'
    )
  }
}

/**
 * Converts a date string from ISO format to custom formatted date string
 * @param {string} fechaISO - Date string in format "YYYY-MM-DDTHH:mm:ss.SSSSSSZ"
 * @returns {string} Formatted date string in format "DD/MM/YYYY HH:mm:ss hs."
 */
export const formatoFechaIso = (fechaISO: string): string => {
  const fecha = new Date(fechaISO)

  const dia = String(fecha.getUTCDate()).padStart(2, '0')
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0')
  const anio = fecha.getUTCFullYear()
  const horas = String(fecha.getUTCHours()).padStart(2, '0')
  const minutos = String(fecha.getUTCMinutes()).padStart(2, '0')
  const segundos = String(fecha.getUTCSeconds()).padStart(2, '0')

  return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos} hs.`
}

/**
 * Obtiene la fecha actual en la zona horaria de Argentina y la formatea
 * para que sea compatible con el formato `YYYY-MM-DD` requerido por los
 * inputs de tipo fecha (`<input type="date">`).
 *
 * @returns {string} La fecha actual en formato `YYYY-MM-DD`.
 */
export const fechaHoyInput = () => {
  const fechaArgentina = new Date().toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })

  const [fechaParte] = fechaArgentina.split(', ')
  const [dia, mes, ano] = fechaParte.split('/')
  const fechaFormateada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`

  return fechaFormateada
}

export const mesActualNombre = () => {
  const fechaActual = new Date()
  const nombresMeses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]

  const mesActual = fechaActual.getMonth()
  const nombreMesActual = nombresMeses[mesActual]

  return nombreMesActual.toUpperCase()
}

export const anioActual = () => {
  const fechaActual = new Date()
  const anioActual = fechaActual.getFullYear()
  return anioActual
}

export const mesActual = () => {
  const fechaActual = new Date()
  const mesActual = fechaActual.getMonth() + 1
  return mesActual
}

export const diaActual = () => {
  const fechaActual = new Date()
  const dayActual = fechaActual.getDate()
  return dayActual
}
