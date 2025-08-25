import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { axios } from '@/utils/axios'
import { UserContext } from '@/context/UserWrapper'
import { schema } from '@/schemas/LoginSchema'
import { setStorage } from '@/utils/localStorage'
import Input from '@/components/Inputs/Input'
import Button from '@/components/Button'
import { toast } from 'react-toastify'

const LoginForm = () => {
  const { actions: ua } = useContext(UserContext)
  const nav = useNavigate()
  const [loginError, setLoginError] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const login = async (form: any) => {
    setLoginError(null)

    form.type = 'internal'

    const response = await axios().post('auth', form)
    const { data, error } = response.data

    if (data) {
      setStorage(data)
      ua.setStore(data)
      nav('/')
    }

    if (error) {
      if (error.general === 'Credenciales incorrectas') {
        setLoginError(error.general)
      } else {
        toast.error('Ocurrió un error inesperado al ingresar al sistema')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(login)} className="space-y-4">
      <h2 className="text-center text-2xl font-bold text-primary-800">
        Ingresar al sistema
      </h2>

      <hr />

      <Input
        control={control}
        label="Correo electrónico / DNI *"
        name="_id"
        placeholder="usuario@gmail.com / 99.999.999"
      />

      <Input
        control={control}
        type="password"
        name="password"
        label="Contraseña *"
        placeholder="********"
      />

      {loginError && (
        <span className="text-red-500 font-medium">{loginError}</span>
      )}

      <Button
        className="w-full"
        textSize="lg"
        type="submit"
        isLoading={isSubmitting}
      >
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  )
}

export default LoginForm
