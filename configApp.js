/**
 * Script para cambiar el nombre de la aplicación
 * Este script modifica varios archivos del proyecto con el nombre y descripción proporcionados
 * También puede crear archivos .env, .env.staging y .env.production si el usuario lo acepta
 * Una vez que se use, se debe eliminar
 */

import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

// Constantes
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Códigos de colores ANSI para la consola
const COLORS = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
}

// Descripción por defecto de la aplicación
const DEFAULT_DESCRIPTION =
  'App oficial de la Municipalidad de Neuquén, diseñada para brindarte acceso rápido a trámites, servicios y noticias en tu ciudad.'

// Archivos a modificar con sus rutas relativas y claves a reemplazar
const FILES_TO_UPDATE = [
  {
    path: './index.html',
    keys: [
      'Template Front Tailwind',
      'template-front-tailwind',
      'descripcion-template-front',
    ],
  },
  {
    path: './package.json',
    keys: [
      'Template Front Tailwind',
      'template-front-tailwind',
      'descripcion-template-front',
    ],
  },
  {
    path: './package-lock.json',
    keys: [
      'Template Front Tailwind',
      'template-front-tailwind',
      'descripcion-template-front',
    ],
  },
  {
    path: './vite.config.ts',
    keys: [
      'Template Front Tailwind',
      'template-front-tailwind',
      'descripcion-template-front',
    ],
  },
]

/**
 * Interfaz para leer entrada del usuario
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

/**
 * Actualiza un archivo con los nuevos valores y devuelve una promesa
 * @param {string} filePath - Ruta del archivo a modificar
 * @param {string[]} keys - Claves a reemplazar
 * @param {Object} values - Valores para reemplazar las claves
 * @returns {Promise<string>} - Promesa que se resuelve con el nombre del archivo actualizado
 */
function updateFile(filePath, keys, values) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(
          `${COLORS.red}Error al leer ${filePath}:`,
          err,
          COLORS.reset
        )
        reject(err)
        return
      }

      let newContent = data
      keys.forEach((key) => {
        let newValue
        if (key.includes('template-front-tailwind'))
          newValue = values.appNameSlug
        else if (key.includes('Template Front Tailwind'))
          newValue = values.appName
        else if (key.includes('descripcion-template-front'))
          newValue = values.description

        newContent = newContent.replace(new RegExp(key, 'g'), newValue)
      })

      fs.writeFile(filePath, newContent, 'utf8', (err) => {
        if (err) {
          console.error(
            `${COLORS.red}Error al escribir en ${filePath}:`,
            err,
            COLORS.reset
          )
          reject(err)
        } else {
          console.log(
            `${COLORS.green}Archivo ${filePath} actualizado con éxito.${COLORS.reset}`
          )
          resolve(filePath)
        }
      })
    })
  })
}

/**
 * Crea archivos .env copiando el contenido de .env.example
 * @returns {Promise<void>} - Promesa que se resuelve cuando se han creado todos los archivos
 */
function createEnvFiles() {
  return new Promise((resolve, reject) => {
    const rootDir = path.join(__dirname, '.')
    const exampleEnvPath = path.join(rootDir, '.env.example')

    // Verificar si existe el archivo .env.example
    fs.access(exampleEnvPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(
          `${COLORS.red}Error: No se encontró el archivo .env.example${COLORS.reset}`
        )
        resolve()
        return
      }

      // Leer el contenido del archivo .env.example
      fs.readFile(exampleEnvPath, 'utf8', (err, data) => {
        if (err) {
          console.error(
            `${COLORS.red}Error al leer .env.example:`,
            err,
            COLORS.reset
          )
          resolve()
          return
        }

        // Contador para saber cuándo se han completado todas las operaciones
        let completedOperations = 0
        const totalOperations = 3

        // Función para verificar si todas las operaciones se han completado
        const checkCompletion = () => {
          completedOperations++
          if (completedOperations === totalOperations) {
            resolve()
          }
        }

        // Crear los archivos .env con el mismo contenido
        fs.writeFile(path.join(rootDir, '.env'), data, 'utf8', (err) => {
          if (err) {
            console.error(
              `${COLORS.red}Error al crear .env:`,
              err,
              COLORS.reset
            )
          } else {
            console.log(
              `${COLORS.green}Archivo .env creado con éxito.${COLORS.reset}`
            )
          }
          checkCompletion()
        })

        fs.writeFile(
          path.join(rootDir, '.env.staging'),
          data,
          'utf8',
          (err) => {
            if (err) {
              console.error(
                `${COLORS.red}Error al crear .env.staging:`,
                err,
                COLORS.reset
              )
            } else {
              console.log(
                `${COLORS.green}Archivo .env.staging creado con éxito.${COLORS.reset}`
              )
            }
            checkCompletion()
          }
        )

        fs.writeFile(
          path.join(rootDir, '.env.production'),
          data,
          'utf8',
          (err) => {
            if (err) {
              console.error(
                `${COLORS.red}Error al crear .env.production:`,
                err,
                COLORS.reset
              )
            } else {
              console.log(
                `${COLORS.green}Archivo .env.production creado con éxito.${COLORS.reset}`
              )
            }
            checkCompletion()
          }
        )
      })
    })
  })
}

/**
 * Función para solicitar el nombre de la aplicación
 * @returns {Promise<string>} - Promesa que se resuelve con el nombre ingresado
 */
function askAppName() {
  return new Promise((resolve) => {
    function promptAppName() {
      rl.question(
        `${COLORS.cyan}Ingrese el nombre de la aplicación (ej: Template Tailwind): ${COLORS.reset}`,
        (appName) => {
          if (appName.trim() === '') {
            console.log(
              `${COLORS.red}El nombre de la aplicación no puede estar vacío. Por favor, inténtelo de nuevo.${COLORS.reset}`
            )
            promptAppName() // Volver a preguntar
          } else {
            resolve(appName.trim())
          }
        }
      )
    }
    promptAppName()
  })
}

/**
 * Función para solicitar el nombre slug de la aplicación
 * @returns {Promise<string>} - Promesa que se resuelve con el slug ingresado
 */
function askAppNameSlug() {
  return new Promise((resolve) => {
    function promptAppNameSlug() {
      rl.question(
        `${COLORS.cyan}Ingrese el nombre de la aplicación en formato slug (ej: template-tailwind): ${COLORS.reset}`,
        (appNameSlug) => {
          if (appNameSlug.trim() === '') {
            console.log(
              `${COLORS.red}El nombre slug no puede estar vacío. Por favor, inténtelo de nuevo.${COLORS.reset}`
            )
            promptAppNameSlug() // Volver a preguntar
          } else {
            resolve(appNameSlug.trim())
          }
        }
      )
    }
    promptAppNameSlug()
  })
}

/**
 * Función principal que ejecuta el script
 */
async function main() {
  console.log(
    `${COLORS.bold}${COLORS.green}Este script cambiará el nombre de la aplicación y descripción.${COLORS.reset}\n`
  )

  try {
    // Solicitar nombre de la aplicación (obligatorio)
    const appName = await askAppName()

    // Solicitar nombre slug de la aplicación (obligatorio)
    const appNameSlug = await askAppNameSlug()

    // Mostrar descripción por defecto
    console.log(`\n${COLORS.yellow}Descripción por defecto:${COLORS.reset}`)
    console.log(`${COLORS.bold}${DEFAULT_DESCRIPTION}${COLORS.reset}\n`)

    // Preguntar por la descripción (opcional)
    const description = await new Promise((resolve) => {
      rl.question(
        `${COLORS.cyan}¿Desea cambiarla? (Presione Enter para mantenerla o ingrese una nueva descripción): ${COLORS.reset}`,
        (customDescription) => {
          resolve(customDescription.trim() || DEFAULT_DESCRIPTION)
        }
      )
    })

    // Valores para reemplazar en los archivos
    const values = {
      appName,
      appNameSlug,
      description,
    }

    // Actualizar cada archivo
    const updatePromises = FILES_TO_UPDATE.map(
      ({ path: relativePath, keys }) => {
        const filePath = path.join(__dirname, relativePath)
        return updateFile(filePath, keys, values)
      }
    )

    await Promise.all(updatePromises)
    console.log(
      `\n${COLORS.bold}${COLORS.green}Archivos actualizados con éxito.${COLORS.reset}`
    )

    // Preguntar si desea crear los archivos .env
    const createEnv = await new Promise((resolve) => {
      rl.question(
        `\n${COLORS.cyan}¿Desea crear los archivos .env, .env.staging y .env.production a partir de .env.example? ${COLORS.bold}¡Si ya existen serán reemplazados!${COLORS.reset} (s/n): ${COLORS.reset}`,
        (answer) => {
          resolve(
            answer.toLowerCase() === 's' ||
              answer.toLowerCase() === 'si' ||
              answer.toLowerCase() === 'sí'
          )
        }
      )
    })

    if (createEnv) {
      console.log(`\n${COLORS.yellow}Creando archivos .env...${COLORS.reset}`)
      await createEnvFiles()
      console.log(
        `\n${COLORS.bold}${COLORS.green}Proceso completado. Se crearon los archivos .env.${COLORS.reset}`
      )
    } else {
      console.log(
        `\n${COLORS.bold}${COLORS.green}Proceso completado. No se crearon archivos .env.${COLORS.reset}`
      )
    }

    // Cerrar la interfaz de readline
    rl.close()

    // Esperar un poco antes de eliminar el script
    setTimeout(() => {
      fs.unlink(__filename, (err) => {
        if (err) {
          console.error(
            `${COLORS.red}Error al eliminar el script:`,
            err,
            COLORS.reset
          )
        } else {
          console.log(
            `${COLORS.green}El script se eliminó automáticamente.${COLORS.reset}`
          )
        }
      })
    }, 1000) // Un pequeño delay para evitar conflictos de ejecución
  } catch (error) {
    console.error(
      `${COLORS.red}Error durante la ejecución:${COLORS.reset}`,
      error
    )
    rl.close()
  }
}

// Ejecutar el script y al terminar lo elimina
main()
