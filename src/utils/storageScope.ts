function trimEndSlash(s: string) {
    return s.replace(/\/+$/, '')
  }
  
  export const getAppScope = () => {
    const origin = window.location.origin
    const base =
      ((import.meta as any).env?.BASE_URL as string | undefined) ?? '/'
  
    const normalized = trimEndSlash(base)
  
    return normalized === '/' || normalized === ''
      ? origin
      : origin + normalized
  }
  
  export const scopedKey = (name: string) => {
    return `mx:${getAppScope()}:${name}`
  }
  