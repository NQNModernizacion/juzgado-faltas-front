/**
 * Configura los errores del formulario con los mensajes de validación del backend.
 *
 * @param {Object} response - Respuesta del backend.
 * @param {Function} setError - Función de React Hook Form para establecer errores en el formulario.
 * @returns {boolean} - Devuelve `true` si hay errores, `false` en caso contrario.
 *
 * Obtiene los mensajes de error por campo, los concatena con saltos de línea y los aplica en el formulario.
 */
export const mostrarValidacionesBack = (response, setError) => {
  if (response.status === 422) {
    // Obtener claves del objeto de errores
    const claves = Object.keys(response.data.error)

    claves.forEach((clave) => {
      // Array de errores del campo
      const mensajes = response.data.error[clave]

      // Concatenar todos los mensajes con saltos de línea
      const mensajeConcatenado = mensajes.join('\n')

      // Setea el error en el formulario
      setError(clave, {
        type: 'manual',
        message: mensajeConcatenado,
      })
    })

    return true // Indica que hay errores
  }

  return false // Indica que no hay errores
}
