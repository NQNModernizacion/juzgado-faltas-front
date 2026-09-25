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

---

# Integración de TinyMCE (Self-Hosted / 100% Offline y Gratuito)

En este proyecto se utiliza **TinyMCE** como procesador de textos para la redacción de documentos legales, resoluciones y sentencias. Está configurado en modalidad **Self-Hosted** (100% libre, gratuito y sin llamadas a servicios Cloud ni necesidad de API Key).

## 1. Arquitectura y Beneficios
- **Aislamiento por `<iframe>`:** Los estilos globales de la aplicación (Tailwind, MUI) no contaminan el texto redactado por el usuario, ni el documento altera la maquetación del sistema.
- **Sin Dependencias Externas:** Todos los assets (modelo DOM, tema Silver, iconos, plugins y skins) se empaquetan en el bundle local mediante Vite.
- **Licencia GPL Libre:** Al usar `licenseKey="gpl"`, se eliminan todos los avisos de registro o claves de TinyMCE Cloud.

## 2. Paso a Paso para Usar/Replicar en Otro Proyecto

### Paso 1: Instalación de Dependencias
```bash
npm install tinymce @tinymce/tinymce-react --no-audit
```

### Paso 2: Diccionario de Idioma Español (Offline)
Crear un archivo helper (ej. `src/utils/tinymce-es.ts` o en la carpeta del componente) que registre el diccionario en memoria:
```typescript
import tinymce from 'tinymce/tinymce';

tinymce.addI18n('es', {
  'Redo': 'Rehacer',
  'Undo': 'Deshacer',
  'Cut': 'Cortar',
  'Copy': 'Copiar',
  'Paste': 'Pegar',
  'Bold': 'Negrita',
  'Italic': 'Cursiva',
  'Underline': 'Subrayado',
  'Align left': 'Alinear a la izquierda',
  'Align center': 'Alinear al centro',
  'Align right': 'Alinear a la derecha',
  'Justify': 'Justificar',
  'Bullet list': 'Lista de viñetas',
  'Numbered list': 'Lista numerada',
  'Table': 'Tabla',
  'Page break': 'Salto de página',
  'Fullscreen': 'Pantalla completa',
  'Fonts': 'Fuentes',
  'Font sizes': 'Tamaños de fuente',
  // ... resto del diccionario oficial
});
```

### Paso 3: Componente del Editor
```tsx
import { useRef } from 'react';
import type { Editor as TinyMCEEditor } from 'tinymce';
import { Editor } from '@tinymce/tinymce-react';

// 1. Núcleo, DOM, tema e iconos locales
import 'tinymce/tinymce';
import 'tinymce/models/dom/model';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';

// 2. Estilos visuales de la barra y diálogos
import 'tinymce/skins/ui/oxide/skin.css';

// 3. Diccionario en español
import './tinymce-es';

// 4. Plugins modulares necesarios
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/table';
import 'tinymce/plugins/wordcount';

interface Props {
  value: string;
  onChange: (content: string) => void;
  height?: number;
}

export const TextEditor = ({ value, onChange, height = 550 }: Props) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <Editor
      licenseKey="gpl"
      onInit={(_evt, editor) => {
        editorRef.current = editor;
      }}
      value={value}
      onEditorChange={(newContent) => onChange(newContent)}
      init={{
        height,
        language: 'es',

        // 🚫 Desactivar elementos comerciales
        promotion: false, // Quita el botón "Upgrade"
        branding: false,  // Quita el logo "Powered by TinyMCE"

        // 📌 Barra de menús (omitiendo 'file' para evitar abrir o crear docs locales)
        menubar: 'edit view insert format tools table',

        // 📦 Plugins activos
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image',
          'charmap', 'searchreplace', 'fullscreen', 'pagebreak',
          'table', 'wordcount'
        ],

        // 🛠 Barra de herramientas (Toolbar)
        toolbar: [
          'undo redo | blocks fontfamily fontsize | bold italic underline forecolor backcolor',
          'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
          'table | pagebreak searchreplace | fullscreen'
        ].join(' | '),

        // 🔤 Tipografías y tamaños
        font_family_formats:
          'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Courier New=courier new,courier,monospace;',
        font_size_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 24pt',

        // ✂️ Compatibilidad con PDF (Laravel Spatie PDF / Chromium)
        pagebreak_separator: '<div class="page-break" style="page-break-after: always; break-after: page;"></div>',
        pagebreak_split_block: true,

        // 🎨 Estilos del contenido interno del iframe
        content_style: `
          body { 
            font-family: Arial, sans-serif; 
            font-size: 11pt; 
            line-height: 1.5; 
            padding: 15px; 
            color: #222; 
          }
          table { border-collapse: collapse; width: 100%; }
          table, th, td { border: 1px solid #aaa; }
          th, td { padding: 6px; }

          /* Línea divisoria roja visible para saltos de página */
          .mce-pagebreak {
            cursor: default;
            display: block;
            border: 0;
            border-top: 2px dashed #dc2626;
            width: 100%;
            height: 8px;
            margin: 25px 0 15px 0;
            background-color: #fee2e2;
            page-break-before: always;
          }
        `,

        // ⚡ Obligatorio para Self-Hosted sin llamadas HTTP externas
        skin: false,
        content_css: false,
      }}
    />
  );
};
```

## 3. Opciones Clave y Buenas Prácticas
1. **`licenseKey="gpl"`:** Requerido para evitar el diálogo de alerta sobre dominios no registrados en Tiny Cloud.
2. **`skin: false, content_css: false`:** Bloquea peticiones de red hacia hojas de estilo externas, ya que fueron importadas directamente en el código fuente.
3. **Estilo de `.mce-pagebreak` en `content_style`:** Al usar `content_css: false`, el iframe no incluye estilos de plugins por defecto. La regla CSS para `.mce-pagebreak` es indispensable para que el redactor visualice la franja roja divisoria del salto de hoja.
4. **`pagebreak_separator`:** Genera un elemento HTML con `page-break-after: always; break-after: page;` para que **Laravel Spatie PDF (Chromium)** reconozca el corte de página con exactitud al generar el archivo PDF.
5. **Borrado de Saltos de Página:** Al borrar la franja roja en el editor con `Backspace` o `Supr`, el nodo se elimina del DOM y no se emite el separador al backend, permitiendo que el PDF continúe de forma fluida.