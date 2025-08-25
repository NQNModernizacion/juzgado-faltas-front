import { WEBLOGIN_URL } from '../config'
import { Store } from '../interfaces'
import { axios } from './axios'

const KEY = window.location.origin as string

export const getStorage = () =>
  JSON.parse(localStorage.getItem(KEY) as string) as Store | null

export const getAppData = () => getStorage()?.app_data

export const removeUser = () => {
  localStorage.removeItem(KEY)
}

export const setStorage = (s: Store | null) =>
  localStorage.setItem(KEY, JSON.stringify(s))

export const getToken = () => getStorage()?.token

export const viewSession = () => console.info(getStorage())

export const logout = async () => {
  await axios().post('logout')
  localStorage.removeItem(KEY)
  window.location.href = WEBLOGIN_URL
}
