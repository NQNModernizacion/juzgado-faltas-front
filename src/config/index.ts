export const URL_BACK = import.meta.env.VITE_URL_BACK
export const WEBLOGIN_URL = import.meta.env.VITE_WEBLOGIN_URL
export const ASSETS_URL = import.meta.env.VITE_ASSETS_URL

const config = {
  URL_BACK: URL_BACK,
  WEBLOGIN_URL: WEBLOGIN_URL,
}

export const viewAllConfig = () => console.table(config)
