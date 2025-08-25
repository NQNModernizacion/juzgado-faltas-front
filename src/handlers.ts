import { setStorage } from './utils/localStorage'
import { getParams, removeURLParameter } from './utils/common'
import { Actions } from './interfaces'
import { axios } from './utils/axios'
import { toast } from 'react-toastify'
import { toastOptions } from './config/toast'

export const initApp = async (ua: Actions) => {
  const token = getParams().token

  if (token) {
    showSpinner(true)
    const response = await axios(token).post('auth', { type: 'app_login' })
    showSpinner(false)

    const { data, error } = response.data

    if (data) {
      ua.setStore(data)
      setStorage(data)
    }

    if (error) {
      toast.error(error, toastOptions)
      return null
    }

    let url = removeURLParameter(window.location.href, 'token')
    url = url + '#/'
    window.location.href = url
    // retornamos a weblogin o al internal login
  }
  ua.setLoading(false)
}

/** Enviamos un bool para mostrar el spinner principal */
export const showSpinner = (loading: boolean) => {
  if (loading) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    window.cargarSpinner()
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    window.eliminarSpinner()
  }
}
