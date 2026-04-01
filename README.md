# Template Frontend 2026

Este proyecto es un template base para aplicaciones frontend que utilizan la librería de componentes @nqnmodernizacion/muni-ui. 

1. Clonar repositorio:

git clone <repo-url>
cd <template-front-2026>

# Configuración inicial

1. Ejecutar el script para configurar la aplicación:

   ```sh
   node configApp.js
   ```

   ---
2. Ejecutar `npm install`

# Build

- Réplica: `npm run build:replica`
- Producción: `npm run build`

# UI y estilos

Este proyecto utiliza la librería:

@nqnmodernizacion/muni-ui

Incluye:

Componentes reutilizables
Tokens de diseño
Estilos base
Preset de Tailwind
Importaciones necesarias

En el entry point (main.tsx o index.tsx):

import "@nqnmodernizacion/muni-ui/tokens.css";
import "@nqnmodernizacion/muni-ui/styles.css";

En tailwind.config.js:

import muniPreset from "@nqnmodernizacion/muni-ui/tailwind-preset";

export default {
  presets: [muniPreset],
};