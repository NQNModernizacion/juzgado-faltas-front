export const slugToCapitalize = (
  valor: string | null | undefined
): string | null => {
  if (!valor) return null

  return valor
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const slugToCapitalizeTitle = (
  valor: string | null | undefined
): string | null => {
  if (!valor) return null

  const palabrasNoMayuscula = new Set([
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
  ])

  return valor
    .split(/[-_]/)
    .map((word, index) =>
      index === 0 || !palabrasNoMayuscula.has(word.toLowerCase())
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toLowerCase()
    )
    .join(' ')
}

export const capitalizeTitle = (text: string): string => {
  const palabrasNoMayuscula = new Set([
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
  ])

  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) =>
      index === 0 || !palabrasNoMayuscula.has(word)
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(' ')
}

export const capitalize = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const formatoPesos = (
  numero: number | string | null | undefined
): string | null => {
  if (!numero) return null

  const valorNumerico = typeof numero === 'number' ? numero : parseFloat(numero)
  if (isNaN(valorNumerico)) return null

  return valorNumerico.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const milisegundosATexto = (milisegundos: number): string => {
  const segundosTotales = Math.floor(milisegundos / 1000)
  const dias = Math.floor(segundosTotales / 86400)
  const horas = Math.floor((segundosTotales % 86400) / 3600)
  const minutos = Math.floor((segundosTotales % 3600) / 60)
  const segundos = segundosTotales % 60

  const partes: string[] = []
  if (dias > 0) partes.push(`Días: ${dias}`)
  if (horas > 0) partes.push(`Horas: ${horas}`)
  if (minutos > 0) partes.push(`Minutos: ${minutos}`)
  if (segundos > 0 || partes.length === 0) partes.push(`Segundos: ${segundos}`)

  return partes.join(', ')
}
