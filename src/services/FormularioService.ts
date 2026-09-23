import { axios } from '@/utils/axios'

export interface Plantilla {
  id: number
  codigo: string
  nombre: string
}

export interface FormularioPrecargado {
  acta_id: number | string
  plantilla_id: number
  plantilla_codigo: string
  plantilla_nombre: string
  tipo: string
  contenido_html: string
}

export interface GuardarFormularioPayload {
  plantilla_documento_id: number
  tipo: string
  contenido_html: string
}

export interface FormularioGuardado {
  id: number
  tipo: string
  created_at: string
  plantilla?: {
    id: number
    codigo: string
    nombre: string
  }
}

export interface DocumentoPdfResponse {
  data: {
    type: string
    file_name: string
    size: number
    file: string
  }
}

/**
 * Obtiene la lista de plantillas disponibles para el combo selector.
 */
export const getPlantillas = async (): Promise<Plantilla[]> => {
  const resp = await axios().get('/plantillas')
  return resp.data.data ?? resp.data ?? []
}

/**
 * Precarga el contenido HTML de una plantilla para un acta específica.
 */
export const precargarFormulario = async (
  actaId: string | number,
  codigo: string
): Promise<FormularioPrecargado> => {
  const resp = await axios().get(`/actas/${actaId}/formularios/precargar/${codigo}`)
  return resp.data.data ?? resp.data
}

/**
 * Guarda un formulario editado para el acta dada.
 */
export const guardarFormulario = async (
  actaId: string | number,
  payload: GuardarFormularioPayload
): Promise<unknown> => {
  const resp = await axios().post(`/actas/${actaId}/formularios`, payload)
  return resp.data.data ?? resp.data
}

/**
 * Lista los formularios previamente guardados / emitidos para un acta.
 */
export const getFormulariosActa = async (
  actaId: string | number
): Promise<FormularioGuardado[]> => {
  const resp = await axios().get(`/actas/${actaId}/formularios`)
  return resp.data.data ?? resp.data ?? []
}

/**
 * Obtiene el PDF (Base64) de un documento para previsualizar o descargar.
 */
export const getPdfDocumento = async (
  documentoId: string | number
): Promise<DocumentoPdfResponse> => {
  const resp = await axios().get(`/documentos/${documentoId}/pdf`)
  return resp.data
}
