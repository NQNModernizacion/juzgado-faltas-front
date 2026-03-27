import { object } from 'yup'
import { _id, password } from './_validaciones'

export const schema = object({
  _id: _id.required('Correo electrónico o documento es requerido'),
  password: password.required('Contraseña es requerida'),
})
