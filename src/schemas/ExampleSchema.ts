import { object } from 'yup'
import { asunto, prioridad_id, tipo_id } from './_validaciones'

export const schema = object({
  asunto: asunto.required('El asunto es requerido'),
  prioridad_id: prioridad_id.typeError('Debe seleccionar prioridad'),
  tipo_id: tipo_id,
})
