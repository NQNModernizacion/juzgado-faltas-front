import { useEffect, useState } from 'react'

const useOpciones = (data: any[], formatTitle: (item: any) => string, defaultTitle?: string) => {
  const [opciones, setOpciones] = useState([])

  useEffect(() => {
    const aux = []

    // Si se manda el titulo, se agrega como opcion por defecto
    if (defaultTitle) {
      aux.push({ value: '', label: defaultTitle })
    }

    if (data) {
      for (const key in data) {
        const item = data[key]

        aux.push({
          value: item.id,
          label: formatTitle(item),
        })
      }
    }

    setOpciones(aux)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return opciones
}

export default useOpciones
