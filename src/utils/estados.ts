interface Estado {
  id: string
  description: string
  background_color: string
  color: string
}

interface Provider {
  id: string
  persona?: {
    correoElectronico?: string
  }
}

interface Model {
  id: string
  persona?: {
    correoElectronico?: string
  }
}

interface Option {
  value: string
  label: string
  background_color?: string
  color?: string
}

export const formatEstados = (states: Estado[] | null): Option[] => {
  if (!states) return []

  return states.map((curr) => formatEstado(curr))
}

export const formatEstado = (estado: Estado): Option => {
  if (estado) {
    return {
      value: estado.id,
      label: estado.description,
      background_color: estado.background_color,
      color: estado.color,
    }
  }
  return { value: '', label: '' } // Por si el estado no está definido
}

export const formatProvider = (provider: Provider | null): Option | null => {
  if (provider) {
    return {
      value: provider.id,
      label: provider.email ?? 'userID: ' + provider.id,
    }
  }

  return null
}

export const formatProviders = (providers: Provider[] | null): Option[] => {
  if (!providers) {
    return []
  }
  return providers
    .map((curr) => formatProvider(curr))
    .filter((provider): provider is Option => provider !== null)
}

export const formatModel = (model: Model | null): Option | null => {
  if (model) {
    return {
      value: model.id,
      label: model.email ?? 'userID: ' + model.id,
    }
  }

  return null
}

export const formatModels = (models: Model[] | null): Option[] => {
  if (!models) {
    return []
  }
  return models
    .map((curr) => formatModel(curr))
    .filter((model): model is Option => model !== null)
}
