import { object, string, number, date, array } from 'yup';

const toNumber = (value: any) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return Number(value);
};

const toDate = (_value: any, originalValue: any) => {
  if (originalValue === undefined || originalValue === null || originalValue === "") {
    return undefined;
  }
  return new Date(originalValue);
};

// Validaciones para campos individuales
const year = string()
  .required('El año del acta es requerido')
  .matches(/^\d{4}$/, 'El año debe tener 4 dígitos');

const numero_acta = string()
  .required('El número del acta es requerido')
  .matches(/^\d+$/, 'El número del acta debe ser numérico');

const oficina_id = number()
  .transform(toNumber)
  .required('La oficina es requerida')
  .typeError('La oficina debe ser un número')
  .integer('Debe ser un número entero');

const fecha_labrada = date()
  .transform(toDate)
  .required('La fecha labrada es requerida')
  .typeError('Fecha inválida');

const fecha_carga = date()
  .transform(toDate)
  .required('La fecha de carga es requerida')
  .typeError('Fecha inválida');

const tipo_id = number()
  .transform(toNumber)
  .required('El tipo de acta es requerido')
  .typeError('El tipo de acta debe ser un número')
  .integer('Debe ser un número entero');

const sub_tipo_id = number()
  .transform(toNumber)
  .required('El subtipo de acta es requerido')
  .typeError('El subtipo de acta debe ser un número')
  .integer('Debe ser un número entero');

const ley_id = number()
  .transform(toNumber)
  .required('La ley es requerida')
  .typeError('La ley debe ser un número')
  .integer('Debe ser un número entero');

const lugar = string()
  .required('El lugar es requerido')
  .min(2, 'El lugar debe tener al menos 2 caracteres');

const calle_id = number()
  .transform(toNumber)
  .required('La calle es requerida')
  .typeError('La calle debe ser un número')
  .integer('Debe ser un número entero');

const cruce_id = string().optional();

const estado_acta_id = number()
  .transform(toNumber)
  .required('El estado es requerido')
  .typeError('El estado debe ser un número')
  .integer('Debe ser un número entero');

const fecha_notificado = string()
  .optional()
  .typeError('Fecha inválida');

const desestimada = number()
  .transform(toNumber)
  .optional()
  .typeError('El valor debe ser un número')
  .integer('Debe ser un número entero');

const inspector_1_id = number()
  .transform(toNumber)
  .required('El inspector es requerido')
  .typeError('El inspector debe ser un número')
  .integer('Debe ser un número entero');

const inspector_2_id = number()
  .transform(toNumber)
  .optional()
  .typeError('El inspector debe ser un número')
  .integer('Debe ser un número entero');

const color = string().optional();
const caratula = string().optional();
const observacion = string().optional();

// Validaciones para filas de arrays
const baseRowSchema = object().shape({
  tipo_id: string().optional(),
  identificacion: string().optional(),
  nombre: string().optional(),
  categoria_padron_id: string().optional(),
});

const infractorRowSchema = object().shape({
  tipo_id: string().optional(),
  documento: string().optional(),
  identificacion: string().optional(),
  nombre: string().optional(),
  categoria_infractor_id: string().optional(),
  observaciones: string().optional(),
});

const infraccionesRowSchema = array()
  .of(
    object().shape({
      tipo_id: string().optional(),
    })
  )
  .min(1, 'Debe ingresar al menos una infracción');

// Esquema principal
export const AltaActaSchema = object({
  year,
  numero_acta,
  oficina_id,
  fecha_labrada,
  fecha_carga,
  tipo_id,
  sub_tipo_id,
  ley_id,
  lugar,
  calle_id,
  cruce_id,
  estado_acta_id,
  fecha_notificado,
  desestimada,
  inspector_1_id,
  inspector_2_id,
  color,
  caratula,
  observacion,
  Padrones: array().of(baseRowSchema),
  Infractores: array().of(infractorRowSchema),
  Infracciones: infraccionesRowSchema,
});