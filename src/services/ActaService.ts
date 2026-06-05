import { toastOptions } from '@/config/toast'
import { axios } from '@/utils/axios'
import { formatoFecha } from '@/utils/date'
import { toast } from 'react-toastify'

export const onSubmitAlta = async (
  formData: any,
  setIsLoading: any,
  nav: any
) => {
  try {
    formData.padrones = formData.Padrones
    formData.infractores = formData.Infractores
    formData.infracciones = Array.isArray(formData.Infracciones)
      ? formData.Infracciones.map((item: any) => ({
          infraccion_id: item.tipo_id,
        }))
      : []

    formData.fecha_labrada = new Date(formData.fecha_labrada)
      .toISOString()
      .split('T')[0]
    formData.fecha_carga = new Date(formData.fecha_carga)
      .toISOString()
      .split('T')[0]
    formData.fecha_notificado = formData.fecha_notificado
      ? new Date(formData.fecha_notificado).toISOString().split('T')[0]
      : null

    // formData.fecha_labrada = '2026-05-19 00:00:00';
    // formData.fecha_labrada = new Date(formData.fecha_labrada).toLocaleDateString();
    // formData.fecha_labrada = new Date(formData.fecha_labrada).toLocaleDateString();

    console.log('formData', formData)
    // return;

    const resp = await axios().post('/registrar_acta', formData)
    const { data, error } = resp.data

    console.log('data', data)

    if (!data) throw new Error('Error al registrar el acta')

    toast.success('Acta registrada correctamente', toastOptions)

    // nav(`/acta/listado`);
  } catch (error: any) {
    toast.error(error.message, toastOptions)
  } finally {
    setIsLoading(false)
  }
}
export const getDatosInicialesActa = async (
  setIsLoading: any,
  setDatosIniciales: any
) => {
  try {
    setIsLoading(true)
    const resp = await axios().get('/datos_acta')
    const { data, error } = resp.data

    console.log('data', data)

    // return;

    if (!data) throw new Error('Error al obtener los datos iniciales')

    setDatosIniciales(data)
  } catch (error: any) {
    toast.error(error.message, toastOptions)
  } finally {
    setIsLoading(false)
  }
}

export const getActas = async (setActas: any, setIsLoading: any) => {
  try {
    setIsLoading(true)

    const resp = await axios().get('actas')
    const { data, error } = resp.data

    console.log('resp', resp)
    console.log('data', data)

    // return;

    if (!data) throw new Error('Error al obtener las actas')

    setActas(data.data)
  } catch (error: any) {
    toast.error(error.message, toastOptions)
  } finally {
    setIsLoading(false)
  }
}

export const getActa = async (id: any, setActa: any, setIsLoading: any) => {
  try {
    setIsLoading(true)

    const resp = await axios().get(`actas/${id}`)
    const { data, error } = resp.data

    console.log('data', data)

    if (!data) throw new Error('Error al obtener el acta')

    setActa(data)
  } catch (error: any) {
    toast.error(error.message, toastOptions)
  } finally {
    setIsLoading(false)
  }
}

export const getMovimientosActa = async (
  id: any,
  setMovimientos: any,
  setIsLoading: any
) => {
  try {
    setIsLoading(true)
    const resp = await axios().get(`actas/${id}/movimientos`)
    // La API puede retornar los datos en resp.data.data o resp.data, chequeamos:
    const data = resp.data.data || resp.data

    if (!data) throw new Error('Error al obtener los movimientos')

    setMovimientos(data)
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error.message, toastOptions)
  } finally {
    setIsLoading(false)
  }
}

export const postMoverCausa = async (
  payload: any,
  onSuccess: any,
  setIsLoading: any
) => {
  try {
    setIsLoading(true)
    const resp = await axios().post(`mover_causa`, payload)

    toast.success('Causa movida correctamente', toastOptions)
    if (onSuccess) onSuccess()
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error.message, toastOptions)
  } finally {
    setIsLoading(false)
  }
}

export const postAgruparActas = async (
  actasIds: any[],
  onSuccess: any,
  setIsLoading: any
) => {
  try {
    setIsLoading(true)
    // Enviamos el array de IDs en la key 'actas'
    const resp = await axios().post(`agrupar_actas`, { actas: actasIds })
    toast.success('Actas agrupadas exitosamente', toastOptions)
    if (onSuccess) onSuccess(resp.data)
  } catch (error: any) {
    // console.log(error)

    toast.error(error?.message || 'Error al agrupar actas', toastOptions)
  } finally {
    setIsLoading(false)
  }
}

export const postAgregarAGrupo = async (
  grupoId: any,
  actasIds: any[],
  onSuccess: any,
  setIsLoading: any
) => {
  try {
    setIsLoading(true)
    const resp = await axios().post(`agregar_a_grupo`, {
      grupo_id: grupoId,
      actas: actasIds,
    })
    toast.success('Añadido al grupo exitosamente', toastOptions)
    if (onSuccess) onSuccess(resp.data)
  } catch (error: any) {
    toast.error(
      error?.message || 'Error al añadir al grupo',
      // error?.response?.data?.message || 'Error al añadir al grupo',
      toastOptions
    )
  } finally {
    setIsLoading(false)
  }
}

export const postDesagruparActas = async (
  actasIds: any[],
  onSuccess: any,
  setIsLoading: any
) => {
  try {
    setIsLoading(true)
    const resp = await axios().post(`desagrupar_actas`, { actas: actasIds })
    toast.success('Actas desagrupadas exitosamente', toastOptions)
    if (onSuccess) onSuccess(resp.data)
  } catch (error: any) {
    // toast.error(
    //   error?.response?.data?.message || 'Error al desagrupar actas',
    //   toastOptions
    // )
    toast.error(error?.message || 'Error al desagrupar actas', toastOptions)
  } finally {
    setIsLoading(false)
  }
}

export const getGrupoActa = async (
  actaId: any,
  setIsLoading: any,
  setGrupoState: any
) => {
  try {
    setIsLoading(true)
    const resp = await axios().get('/grupos_de_acta/' + actaId)
    const { data, error } = resp.data
    if (!data) throw new Error('Error al obtener el grupo del acta.')

    setGrupoState(data)
  } catch (error: any) {
    toast.error(error.message, toastOptions)
  } finally {
    setIsLoading(false)
  }
}

export const getGruposActas = async (
  setGrupos: any,
  setIsLoading: any
) => {
  try {
    setIsLoading(true)
    const resp = await axios().get('grupos_actas')
    const { data } = resp.data ?? {}
    if (!data) throw new Error('Error al obtener los grupos de actas')
    setGrupos(data)
  } catch (error: any) {
    toast.error(error.message || 'Error al obtener los grupos de actas', toastOptions)
  } finally {
    setIsLoading(false)
  }
}

export const getGrupoActaDetail = async (
  grupoId: any,
  setGrupoDetail: any,
  setIsLoading: any
) => {
  try {
    setIsLoading(true)
    const resp = await axios().get(`grupos_actas/${grupoId}`)
    const { data } = resp.data ?? {}
    if (!data) throw new Error('Error al obtener el detalle del grupo')
    setGrupoDetail(data)
  } catch (error: any) {
    toast.error(error.message || 'Error al obtener el detalle del grupo', toastOptions)
  } finally {
    setIsLoading(false)
  }
}
