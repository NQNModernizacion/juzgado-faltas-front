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

import * as yup from "yup";

const onlyDigits = (value: unknown) => String(value ?? "").replace(/\D/g, "");
const normalizeText = (value: unknown) => String(value ?? "").trim();

export const isValidDni = (value: unknown) => {
  const dni = onlyDigits(value);
  return /^\d{7,8}$/.test(dni);
};

export const isValidCuit = (value: unknown) => {
  const cuit = onlyDigits(value);

  if (!/^\d{11}$/.test(cuit)) return false;

  const digits = cuit.split("").map(Number);
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

  const sum = weights.reduce((acc, weight, index) => {
    return acc + digits[index] * weight;
  }, 0);

  const mod11 = 11 - (sum % 11);
  const verifier = mod11 === 11 ? 0 : mod11 === 10 ? 9 : mod11;

  return verifier === digits[10];
};

export const isValidPatente = (value: unknown) => {
  const patente = normalizeText(value).toUpperCase();

  const oldFormat = /^[A-Z]{3}\d{3}$/;
  const mercosurFormat = /^[A-Z]{2}\d{3}[A-Z]{2}$/;

  return oldFormat.test(patente) || mercosurFormat.test(patente);
};

export const isValidCellphone = (value: unknown) => {
  const celular = onlyDigits(value);
  return celular.length >= 10 && celular.length <= 13;
};

export const yupDni = (required = false) => {
  let schema = yup
    .string()
    .transform((value) => normalizeText(value))
    .test("dni", "El DNI no es válido", (value) => {
      if (!value) return true;
      return isValidDni(value);
    });

  if (required) {
    schema = schema.required("El DNI es obligatorio");
  }

  return schema;
};

export const yupCuit = (required = false) => {
  let schema = yup
    .string()
    .transform((value) => normalizeText(value))
    .test("cuit", "El CUIT/CUIL no es válido", (value) => {
      if (!value) return true;
      return isValidCuit(value);
    });

  if (required) {
    schema = schema.required("El CUIT/CUIL es obligatorio");
  }

  return schema;
};

export const yupPatente = (required = false) => {
  let schema = yup
    .string()
    .transform((value) => normalizeText(value).toUpperCase())
    .test("patente", "La patente no es válida", (value) => {
      if (!value) return true;
      return isValidPatente(value);
    });

  if (required) {
    schema = schema.required("La patente es obligatoria");
  }

  return schema;
};

export const yupCellphone = (required = false) => {
  let schema = yup
    .string()
    .transform((value) => normalizeText(value))
    .test("cellphone", "El celular no es válido", (value) => {
      if (!value) return true;
      return isValidCellphone(value);
    });

  if (required) {
    schema = schema.required("El celular es obligatorio");
  }

  return schema;
};