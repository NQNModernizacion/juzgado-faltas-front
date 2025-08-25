/**
 * Convierte una fecha del formato 'DD/MM/YYYY' o 'DD-MM-YYYY' al formato 'YYYY/MM/DD'.
 *
 * @param {string} fechaOriginal - La fecha original en formato 'DD/MM/YYYY' o 'DD-MM-YYYY'.
 * @returns {string | null} - La fecha formateada en 'YYYY/MM/DD', o null si no se proporciona una fecha válida.
 * @throws {Error} - Si el formato de la fecha no es reconocido.
 */
export const formatoFecha = (fechaOriginal: string): string | null => {
  if (fechaOriginal) {
    let partesFecha
    if (fechaOriginal.includes('/')) {
      partesFecha = fechaOriginal.split('/')
    } else if (fechaOriginal.includes('-')) {
      partesFecha = fechaOriginal.split('-')
    } else {
      throw new Error('Formato de fecha no reconocido. Debe contener "/" o "-" como separadores.')
    }

    if (partesFecha.length === 3) {
      const nuevaFecha = partesFecha[2] + '/' + partesFecha[1] + '/' + partesFecha[0]
      return nuevaFecha
    } else {
      throw new Error('Formato de fecha inválido. La fecha debe tener el formato "DD/MM/YYYY" o "DD-MM-YYYY".')
    }
  } else {
    return null
  }
}

/**
 * Convierte un slug en formato kebab-case o snake_case en una cadena con cada palabra capitalizada.
 *
 * @param {string} text - El texto en formato slug (ej. 'mi-texto-ejemplo').
 * @returns {string | null} - El texto formateado con cada palabra en mayúscula, o null si el texto es vacío.
 */
export const slugToCapitalize = (text: string): string | null => {
  if (!text) return null

  // Divide la cadena de entrada usando los guiones como delimitador
  const words = text.split(/[-_]/)

  // Capitaliza la primera letra de cada palabra y las une con un espacio
  const formattedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  // Une las palabras capitalizadas con un espacio para formar la cadena final
  return formattedWords.join(' ')
}

/**
 * Convierte un slug en formato kebab-case o snake_case en un título capitalizado, respetando reglas de mayúsculas.
 *
 * @param {string} text - El texto en formato slug (ej. 'mi-texto-ejemplo').
 * @returns {string | null} - El texto formateado como título capitalizado, respetando palabras que no deben ir en mayúscula.
 */
export const slugToCapitalizeTitle = (text: string): string | null => {
  if (!text) return null

  // Divide la cadena de entrada usando los guiones como delimitador
  const words = text.split(/[-_]/)

  // Palabras que no deben ir en mayúscula
  const palabrasNoMayuscula = [
    'el',
    'la',
    'los',
    'las',
    'un',
    'una',
    'unos',
    'unas',
    'y',
    'e',
    'ni',
    'o',
    'u',
    'pero',
    'sino',
    'más',
    'si',
    'como',
    'porque',
    'a',
    'ante',
    'bajo',
    'cabe',
    'con',
    'contra',
    'de',
    'desde',
    'durante',
    'en',
    'entre',
    'hacia',
    'hasta',
    'mediante',
    'para',
    'por',
    'según',
    'sin',
    'sobre',
    'tras',
    'versus',
    'vía',
    'yo',
    'tú',
    'él',
    'ella',
    'usted',
    'nosotros',
    'nosotras',
    'vosotros',
    'vosotras',
    'ellos',
    'ellas',
    'ustedes',
    'este',
    'esta',
    'estos',
    'estas',
    'ese',
    'esa',
    'esos',
    'esas',
    'aquel',
    'aquella',
    'aquellos',
    'aquellas',
  ]

  // Capitaliza la primera letra de cada palabra y aplica las reglas de capitalización
  const formattedWords = words.map((word, index) => {
    // Capitaliza la primera letra de la palabra, a menos que sea una de las que no deben ir en mayúscula
    if (index === 0 || !palabrasNoMayuscula.includes(word.toLowerCase())) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
    return word.toLowerCase()
  })

  // Une las palabras capitalizadas con un espacio para formar la cadena final
  return formattedWords.join(' ')
}

/**
 * Convierte la primera letra de cada palabra en una cadena a mayúsculas.
 *
 * @param {string} text - La cadena de entrada.
 * @returns {string} - La cadena con cada palabra capitalizada.
 */
export const capitalize = (text: string): string => {
  text = text.toLowerCase()
  const arr = text.split(' ')

  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }
  return arr.join(' ')
}

/**
 * Convierte la primera letra de cada palabra en una cadena a mayúsculas,
 * respetando palabras que no deben ir en mayúscula, excepto la primera palabra de la frase.
 *
 * @param {string} text - La cadena de entrada.
 * @returns {string} - La cadena con formato de título capitalizado.
 */
export const capitalizeTitle = (text: string): string => {
  const palabras = text.toLowerCase().split(' ')

  // Palabras que no deben ir en mayúscula
  const palabrasNoMayuscula = [
    'el',
    'la',
    'los',
    'las',
    'un',
    'una',
    'unos',
    'unas',
    'y',
    'e',
    'ni',
    'o',
    'u',
    'pero',
    'sino',
    'más',
    'si',
    'como',
    'porque',
    'a',
    'ante',
    'bajo',
    'cabe',
    'con',
    'contra',
    'de',
    'desde',
    'durante',
    'en',
    'entre',
    'hacia',
    'hasta',
    'mediante',
    'para',
    'por',
    'según',
    'sin',
    'sobre',
    'tras',
    'versus',
    'vía',
    'yo',
    'tú',
    'él',
    'ella',
    'usted',
    'nosotros',
    'nosotras',
    'vosotros',
    'vosotras',
    'ellos',
    'ellas',
    'ustedes',
    'este',
    'esta',
    'estos',
    'estas',
    'ese',
    'esa',
    'esos',
    'esas',
    'aquel',
    'aquella',
    'aquellos',
    'aquellas',
  ]

  // Capitalizar la primera letra de la primera palabra
  palabras[0] = palabras[0].charAt(0).toUpperCase() + palabras[0].slice(1)

  // Recorrer las palabras restantes y capitalizar la primera letra de cada una,
  // a menos que estén en la lista de palabras que no deben ir en mayúscula
  for (let i = 1; i < palabras.length; i++) {
    if (!palabrasNoMayuscula.includes(palabras[i])) {
      palabras[i] = palabras[i].charAt(0).toUpperCase() + palabras[i].slice(1)
    }
  }

  // Unir las palabras en una sola cadena
  return palabras.join(' ')
}

/**
 * Formatea un número como una moneda en pesos argentinos (ARS).
 *
 * @param {number | string} number - El número a formatear.
 * @returns {string | null} - El número formateado como moneda en ARS, o null si el valor no es válido.
 */
export const formatoPesos = (number: number | string): string | null => {
  if (!number) return null

  number = parseFloat(number)

  const opciones = {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }

  const formatoPesoArgentino = number.toLocaleString('es-AR', opciones)

  return formatoPesoArgentino
}
