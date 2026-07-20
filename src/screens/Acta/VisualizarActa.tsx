import { editarActa, getActa, getDatosInicialesActa, getCaratulaActa, postMoverCausa } from '@/services/ActaService'
import { Container, RHFInput, Modal, ModalHeader, ModalContent } from '@nqnmodernizacion/muni-ui'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { SelectField } from '@/components/Forms/SelectField'
import { MultiSelectField } from '@/components/Forms/MultiSelectField'
import ColorSelect from '@/components/Forms/ColorSelect'
import ActaTabsForm from '@/components/ActaTabs'
import { COLOR_OPTIONS } from '@/config/actaOptions'
import { MovimientosTab } from './components/MovimientosTab'
import { EstadoProcesalTab } from './components/EstadoProcesalTab'
import { PruebasTab } from './components/PruebasTab'
import { BannerAgrupacion } from './components/BannerAgrupacion'
import { GrupoTab } from './components/GrupoTab'
import { BotonCaratula } from './components/BotonCaratula'
import ChevronLeft from '@/components/Svgs/ChevronLeft'

interface SelectOption {
  id: number
  nombre?: string
  descripcion?: string
}

interface SecretariaCombo {
  id: number
  secretaria?: string
  descripcion?: string
}

interface DatosActaResponse {
  oficinas?: SelectOption[]
  combos?: {
    estados_procesales?: SelectOption[]
    tipos_acta?: SelectOption[]
    sub_tipos?: SelectOption[]
    leyes?: SelectOption[]
    calles?: SelectOption[]
    inspectores?: SelectOption[]
    jueces?: SelectOption[]
    secretarias?: SecretariaCombo[]
    oficinas_internas?: SelectOption[]
    infractores?: unknown[]
    padrones?: unknown[]
    infracciones?: unknown[]
    medida_cautelar_acta?: SelectOption[]
  }
}

interface Acta {
  id: number | string
  numero_acta?: string
  year?: string
  caratula?: string
  color?: string
  estado_acta_id?: number
  medida_cautelar_id?: number | number[]
  cautelares?: SelectOption[]
  tipo_id?: number
  sub_tipo_id?: number
  ley_id?: number
  oficina_id?: number
  fecha_labrada?: string
  fecha_carga?: string
  fecha_notificado?: string
  lugar?: string
  calle_id?: number
  cruce_id?: string
  inspector_1_id?: number
  inspector_2_id?: number
  grupo_acta_id?: number
  grupo?: unknown
  juzgado?: { descripcion?: string } | null
  secretaria?: { codigo?: string; descripcion?: string } | null
  juez?: { codigo?: string; nombre?: string } | null
  ultimo_movimiento?: {
    oficina_destino?: { codigo?: string; descripcion?: string }
  } | null
  padrones?: any[]
  infractores?: any[]
  infracciones?: any[]
  ultimo_estado_procesal?: { id?: number; nombre?: string; estado?: string; estado_procesal_id?: number } | null
}

interface VisualizarActaValues {
  id?: number | string
  numero_acta?: string
  year?: string
  caratula?: string
  color?: string
  estado_procesal_id?: number
  medida_cautelar_id?: number[]
  tipo_id?: number
  sub_tipo_id?: number
  ley_id?: number
  oficina_id?: number
  fecha_labrada?: string
  fecha_carga?: string
  fecha_notificado?: string
  lugar?: string
  calle_id?: number
  cruce_id?: string
  inspector_1_id?: number
  inspector_2_id?: number
  juzgado?: string
  secretaria_codigo?: string
  secretaria_descripcion?: string
  juez_codigo?: string
  juez_nombre?: string
  oficina_interna_codigo?: string
  oficina_interna_descripcion?: string
  juez_subrogante_id?: number
  secretaria_subrogante_id?: number
  movimiento_destino_id?: number
  Padrones?: any[]
  Infractores?: any[]
  Infracciones?: any[]
}

type TabId = 'info' | 'movimientos' | 'estados' | 'pruebas' | 'grupo'

interface TabDef {
  id: TabId
  label: string
  visible?: (acta: Acta) => boolean
}

const TABS: TabDef[] = [
  { id: 'info', label: 'Información del Acta' },
  { id: 'movimientos', label: 'Movimientos' },
  { id: 'estados', label: 'Estado Procesal' },
  { id: 'pruebas', label: 'Pruebas' },
  { id: 'grupo', label: 'Grupo', visible: (acta) => Boolean(acta.grupo_acta_id) },
]

const TAB_BASE = 'px-6 py-3 font-semibold border-b-2 transition-colors'
const TAB_ACTIVE = 'border-blue-500 text-blue-600'
const TAB_INACTIVE = 'border-transparent text-gray-500 hover:text-gray-700'

const formatDate = (value: unknown): string => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value as string)
  return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : ''
}

const mapOptions = (items: SelectOption[] = []) => items.map((it) => ({ value: it.id, label: it.nombre ?? it.descripcion ?? '' }))

export const VisualizarActa = () => {
  const { id } = useParams()
  const [acta, setActa] = useState<Acta | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [datosIniciales, setDatosIniciales] = useState<DatosActaResponse | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('info')

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VisualizarActaValues>({
    defaultValues: {},
  })

  const opciones = useMemo(() => {
    const combos = datosIniciales?.combos
    return {
      estadosActa: mapOptions(combos?.estados_procesales),
      medidasCautelares: mapOptions(combos?.medida_cautelar_acta),
      tiposActa: mapOptions(combos?.tipos_acta),
      subTipos: mapOptions(combos?.sub_tipos),
      leyes: mapOptions(combos?.leyes),
      oficinas: mapOptions(datosIniciales?.oficinas),
      oficinasInternas: mapOptions(combos?.oficinas_internas),
      calles: mapOptions(combos?.calles),
      inspectores: mapOptions(combos?.inspectores),
      juecesSubrogantes: (combos?.jueces ?? []).filter((j) => j.id === 3 || j.id === 4).map((j) => ({ value: j.id, label: j.nombre ?? '' })),
      secretariasSubrogantes: (combos?.secretarias ?? []).filter((s) => s.secretaria === 'Secretaria Subrogante').map((s) => ({ value: s.id, label: s.descripcion ?? '' })),
    }
  }, [datosIniciales])

  useEffect(() => {
    getActa(id, setActa, setIsLoading)
    getDatosInicialesActa(setIsLoading, setDatosIniciales)
  }, [id])

  useEffect(() => {
    if (acta) {
      reset({
        ...acta,
        fecha_labrada: formatDate(acta.fecha_labrada),
        fecha_carga: formatDate(acta.fecha_carga),
        fecha_notificado: formatDate(acta.fecha_notificado),
        medida_cautelar_id: Array.isArray(acta.cautelares)
          ? acta.cautelares.map((c) => c.id)
          : [],
        estado_procesal_id: acta.ultimo_estado_procesal?.estado_procesal_id ?? undefined,
        juzgado: acta.juzgado ? acta.juzgado.descripcion : '',
        Padrones: acta.padrones || [],
        Infractores: acta.infractores || [],
        Infracciones: (acta.infracciones || []).map((inf: any) => ({
          ...inf,
          tipo_id: inf.id,
        })),
        secretaria_codigo: acta.secretaria?.codigo || '',
        secretaria_descripcion: acta.secretaria?.descripcion || '',
        juez_codigo: acta.juez?.codigo || '',
        juez_nombre: acta.juez?.nombre || '',
        oficina_interna_codigo: String(acta.ultimo_movimiento?.oficina_destino?.codigo) || '',
        oficina_interna_descripcion: acta.ultimo_movimiento?.oficina_destino?.descripcion || '',
      })
    }
  }, [acta, reset])

  const handleMovimientoRapido = () => {
    const destino = watch('movimiento_destino_id')
    if (!destino) return
    postMoverCausa(
      { acta_id: id, oficina_id_destino: destino },
      () => {
        setValue('movimiento_destino_id', undefined)
        getActa(id, setActa, setIsLoading)
      },
      setIsLoading
    )
  }

  return (
    <Container title="Visualizar Acta" linkBack="#/acta/listado" backIcon={<ChevronLeft className="size-4 shrink-0 text-primary-700" />}>
      {acta ? (
        <>
          <BannerAgrupacion actaId={id} grupoId={acta.grupo_acta_id} onAgrupacionCambio={() => getActa(id, setActa, setIsLoading)} setIsLoadingGlobal={setIsLoading} />
          <form onSubmit={handleSubmit((formData) => editarActa(formData, setIsLoading))} className="space-y-6">
            {/* TABS PRINCIPALES */}
            <div className="flex border-b">
              {TABS.filter((t) => !t.visible || t.visible(acta)).map((t) => {
                const isActive = activeTab === t.id
                return (
                  <button key={t.id} type="button" onClick={() => setActiveTab(t.id)} className={`${TAB_BASE} ${isActive ? TAB_ACTIVE : TAB_INACTIVE}`}>
                    {t.label}
                  </button>
                )
              })}
            </div>

            {activeTab === 'info' && (
              <div className="space-y-8">
                {/* SECCIÓN: Información Básica */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <h3 className="text-lg font-bold">Información Básica</h3>
                    {id && <BotonCaratula actaId={id} disabled={isLoading} />}
                  </div>

                  <div className="gap-4 mb-4">
                    <MultiSelectField label="Medida Cautelar" name="medida_cautelar_id" control={control} options={opciones.medidasCautelares} error={errors.medida_cautelar_id} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <RHFInput control={control} disabled name="id" label="Número de Causa" />
                      <RHFInput control={control} disabled name="numero_acta" label="Número del Acta" />
                    </div>
                    <RHFInput
                      control={control}
                      name="juzgado"
                      label="Juzgado"
                      disabled
                    />
                    <RHFInput
                      control={control}
                      name="year"
                      label="Año del Acta"
                    />
                    <RHFInput
                      control={control}
                      name="caratula"
                      label="Carátula"
                    />
                    <ColorSelect
                      label="Color"
                      name="color"
                      control={control}
                      options={COLOR_OPTIONS}
                    />
                    <SelectField
                      label="Estado"
                      name="estado_procesal_id"
                      control={control}
                      options={opciones.estadosActa}
                      error={errors.estado_procesal_id}
                      disabled
                    />
                  </div>
                </div>

                {/* SECCIÓN: Mover Causa */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Mover Causa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <RHFInput control={control} name="oficina_interna_descripcion" label="Oficina Actual" disabled />
                    <SelectField label="Oficina Destino" name="movimiento_destino_id" control={control} options={opciones.oficinasInternas} error={errors.movimiento_destino_id} />
                    <button
                      type="button"
                      onClick={handleMovimientoRapido}
                      disabled={isLoading}
                      className="h-10 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirmar Movimiento
                    </button>
                  </div>
                </div>

                {/* SECCIÓN: Clasificación */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Clasificación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SelectField label="Tipo de Acta" name="tipo_id" control={control} options={opciones.tiposActa} error={errors.tipo_id} />
                    <SelectField label="Subtipo de Acta" name="sub_tipo_id" control={control} options={opciones.subTipos} error={errors.sub_tipo_id} />
                    <SelectField label="Ley" name="ley_id" control={control} options={opciones.leyes} error={errors.ley_id} />
                    <SelectField label="Oficina" name="oficina_id" control={control} options={opciones.oficinas} error={errors.oficina_id} />
                  </div>
                </div>

                {/* SECCIÓN: Juzgado y Secretaría */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Juzgado y Secretaría</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <RHFInput control={control} name="secretaria_codigo" label="Secretaria" type="text" disabled />
                    <RHFInput control={control} name="secretaria_descripcion" label="Secretaria" type="text" disabled />
                    <RHFInput control={control} name="juez_codigo" label="Juez" type="text" disabled />
                    <RHFInput control={control} name="juez_nombre" label="Juez" type="text" disabled />
                    <RHFInput control={control} name="oficina_interna_codigo" label="Oficina Interna" type="text" disabled />
                    <RHFInput control={control} name="oficina_interna_descripcion" label="Oficina Interna" type="text" disabled />
                    <SelectField label="Juez Subrogante" name="juez_subrogante_id" control={control} options={opciones.juecesSubrogantes} error={errors.juez_subrogante_id} />
                    <SelectField label="Secretaria subrogante" name="secretaria_subrogante_id" control={control} options={opciones.secretariasSubrogantes} error={errors.secretaria_subrogante_id} />
                  </div>
                </div>

                {/* SECCIÓN: Fechas */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Fechas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <RHFInput control={control} name="fecha_labrada" label="Fecha Labrada" type="date" />
                    <RHFInput control={control} name="fecha_carga" label="Fecha de Carga" type="date" />
                  </div>
                </div>

                {/* SECCIÓN: Ubicación */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Ubicación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <RHFInput control={control} name="lugar" label="Lugar" />
                    <SelectField label="Calle" name="calle_id" control={control} options={opciones.calles} error={errors.calle_id} />
                    <SelectField label="Cruce de Calle" name="cruce_id" control={control} options={opciones.calles} error={errors.cruce_id} />
                  </div>
                </div>

                {/* SECCIÓN: Inspectores */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Inspectores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Inspector" name="inspector_1_id" control={control} options={opciones.inspectores} error={errors.inspector_1_id} />
                    <SelectField label="2° Inspector" name="inspector_2_id" control={control} options={opciones.inspectores} error={errors.inspector_2_id} />
                  </div>
                </div>

                {/* SECCIÓN: Tabs de Involucrados */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <ActaTabsForm control={control} infractores={datosIniciales?.combos?.infractores} padrones={datosIniciales?.combos?.padrones} infracciones={datosIniciales?.combos?.infracciones} />
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex justify-end gap-4 mb-6">
                  <button type="submit" disabled={isLoading} className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'movimientos' && <MovimientosTab actaId={id} oficinas={datosIniciales?.combos?.oficinas_internas || []} setIsLoadingGlobal={setIsLoading} />}

            {activeTab === 'estados' && <EstadoProcesalTab actaId={id} estadosProcesales={opciones.estadosActa} setIsLoadingGlobal={setIsLoading} />}

            {activeTab === 'pruebas' && <PruebasTab actaId={id} />}

            {activeTab === 'grupo' && <GrupoTab actaId={acta.id} grupo={acta.grupo} />}
          </form>
        </>
      ) : (
        <div className="text-center text-gray-500">No se encontró el acta</div>
      )}
    </Container>
  )
}
