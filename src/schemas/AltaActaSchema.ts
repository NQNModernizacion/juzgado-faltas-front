import { object, string, number, date, array } from 'yup';

// Validaciones para campos individuales
const anio_acta = string()
  .required('El año del acta es requerido')
  .matches(/^\d{4}$/, 'El año debe tener 4 dígitos');

const numero_acta = string()
  .required('El número del acta es requerido')
  .matches(/^\d+$/, 'El número del acta debe ser numérico');

const oficina = number()
  .required('La oficina es requerida')
  .integer('Debe ser un número entero');

const fecha_labrada = date()
  .required('La fecha labrada es requerida')
  .typeError('Fecha inválida');

const fecha_carga = date()
  .required('La fecha de carga es requerida')
  .typeError('Fecha inválida');

const tipo_acta = number()
  .required('El tipo de acta es requerido')
  .integer('Debe ser un número entero');

const subtipo_acta = number()
  .required('El subtipo de acta es requerido')
  .integer('Debe ser un número entero');

const ley = number()
  .required('La ley es requerida')
  .integer('Debe ser un número entero');

const lugar = string()
  .required('El lugar es requerido')
  .min(2, 'El lugar debe tener al menos 2 caracteres');

const calle = number()
  .required('La calle es requerida')
  .integer('Debe ser un número entero');

const cruce_calle = string()
  .optional();

const estado = number()
  .required('El estado es requerido')
  .integer('Debe ser un número entero');

const fecha_notificado = date()
  .optional()
  .typeError('Fecha inválida');

const desestimada = number()
  .required('El campo desestimada es requerido')
  .oneOf([1, 2], 'Valor inválido')
  .integer('Debe ser un número entero');

const inspector = number()
  .required('El inspector es requerido')
  .integer('Debe ser un número entero');

const inspector2 = number()
  .optional()
  .integer('Debe ser un número entero');

// Validaciones para filas de arrays
const baseRowSchema = object().shape({
  tipo: string().required('El tipo es requerido'),
  identificacion: string().optional(),
  nombre: string().required('El nombre es requerido'),
  categoria: string().optional(),
});

const infractorRowSchema = object().shape({
  tipo: string().required('El tipo es requerido'),
  documento: string().optional(),
  identificacion: string().optional(),
  nombre: string().required('El nombre es requerido'),
});

// Esquema principal
export const AltaActaSchema = object({
  anio_acta,
  numero_acta,
  oficina,
  fecha_labrada,
  fecha_carga,
  tipo_acta,
  subtipo_acta,
  ley,
  lugar,
  calle,
  cruce_calle,
  estado,
  fecha_notificado,
  desestimada,
  inspector,
  inspector2,
  Padrones: array().of(baseRowSchema),
  Infractores: array().of(infractorRowSchema),
  Infracciones: array().of(baseRowSchema),
});