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
  documento_reemplazado_id?: number
}

export interface FormularioGuardado {
  id: number
  acta_id?: number
  tipo: string
  estado?: 'activo' | 'anulado' | 'reemplazado'
  motivo_anulacion?: string
  documento_reemplazado_id?: number
  reemplazado_por_id?: number | null
  desactualizado?: boolean
  cant_movimientos_posteriores?: number
  cant_estados_posteriores?: number
  file_name?: string
  contenido_html?: string
  plantilla_documento_id?: number
  created_at: string
  updated_at?: string
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
 * Actualiza un formulario previamente emitido/guardado.
 */
export const actualizarFormulario = async (
  documentoId: string | number,
  payload: Partial<GuardarFormularioPayload>
): Promise<unknown> => {
  const resp = await axios().put(`/documentos/${documentoId}`, payload)
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
 * Anula un documento legal emitido registrando el motivo formal.
 */
export const anularFormulario = async (
  documentoId: string | number,
  motivo: string
): Promise<unknown> => {
  const resp = await axios().post(`/documentos/${documentoId}/anular`, { motivo })
  return resp.data.data ?? resp.data
}

/**
 * Reemite un formulario combinando tablas actualizadas del acta con el texto redactado del documento anterior.
 */
export const reemitirFormulario = async (
  actaId: string | number,
  documentoId: string | number
): Promise<FormularioPrecargado & { documento_reemplazado_id: number }> => {
  const resp = await axios().get(`/actas/${actaId}/formularios/reemitir/${documentoId}`)
  return resp.data.data ?? resp.data
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
