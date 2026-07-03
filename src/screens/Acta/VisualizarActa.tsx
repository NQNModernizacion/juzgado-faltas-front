import { editarActa, getActa, getDatosInicialesActa } from '@/services/ActaService'
import { Container, RHFInput } from '@nqnmodernizacion/muni-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { SelectField } from '@/components/Forms/SelectField'
import { MultiSelectField } from '@/components/Forms/MultiSelectField'
import ColorSelect from '@/components/Forms/ColorSelect'
import ActaTabsForm from '@/components/ActaTabs'
import { MovimientosTab } from './components/MovimientosTab'
import { EstadoProcesalTab } from './components/EstadoProcesalTab'
import { PruebasTab } from './components/PruebasTab'
import { BannerAgrupacion } from './components/BannerAgrupacion'
import { GrupoTab } from './components/GrupoTab'
import ChevronLeft from '@/components/Svgs/ChevronLeft'

export const VisualizarActa = () => {
  const { id } = useParams()
  const [acta, setActa] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [datosIniciales, setDatosIniciales] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'movimientos' | 'estados' | 'pruebas' | 'grupo'>(
    'info'
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })
  const fieldErrors = errors as any

  useEffect(() => {
    getActa(id, setActa, setIsLoading)
    getDatosInicialesActa(setIsLoading, setDatosIniciales)
  }, [id])

  useEffect(() => {
    if (acta) {
      const formatDate = (value: any) => {
        if (!value) return ''
        const date = value instanceof Date ? value : new Date(value)
        return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : ''
      }
      reset({
        ...acta,
        fecha_labrada: formatDate(acta.fecha_labrada),
        fecha_carga: formatDate(acta.fecha_carga),
        fecha_notificado: formatDate(acta.fecha_notificado),
        medida_cautelar_id: Array.isArray(acta.medida_cautelar_id)
          ? acta.medida_cautelar_id
          : acta.medida_cautelar_id != null && acta.medida_cautelar_id !== ''
            ? [acta.medida_cautelar_id]
            : [],
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
        oficina_interna_codigo:
          String(acta.ultimo_movimiento?.oficina_destino?.codigo) || '',
        oficina_interna_descripcion:
          acta.ultimo_movimiento?.oficina_destino?.descripcion || '',
      })
    }
  }, [acta, reset])

  return (
    <Container title={'Visualizar Acta'}
      linkBack="#/acta/listado"
      backIcon={<ChevronLeft className="size-4 shrink-0 text-primary-700" />
      }>
      {acta ? (
        <>
          <BannerAgrupacion
            actaId={id}
            grupoId={acta.grupo_acta_id}
            onAgrupacionCambio={() => getActa(id, setActa, setIsLoading)}
            setIsLoadingGlobal={setIsLoading}
          />
          <form onSubmit={handleSubmit(
            (formData) => editarActa(formData, setIsLoading)
          )} className="space-y-6">
            {/* TABS PRINCIPALES */}
            <div className="flex border-b">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Información del Acta
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('movimientos')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'movimientos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Movimientos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('estados')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'estados'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Estado Procesal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pruebas')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'pruebas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Pruebas
              </button>
              {acta.grupo_acta_id && (
                <button
                  type="button"
                  onClick={() => setActiveTab('grupo')}
                  className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'grupo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Grupo
                </button>
              )}
            </div>

            {activeTab === 'info' && (
              <div className="space-y-8">
                {/* SECCIÓN: Información Básica */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Información Básica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <RHFInput
                        control={control}
                        disabled
                        name="id"
                        label="Número de Causa"
                      />
                      <RHFInput
                        control={control}
                        disabled
                        name="numero_acta"
                        label="Número del Acta"
                      />
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <ColorSelect
                        label="Color"
                        name="color"
                        control={control}
                        options={[
                          { value: '#E53935', label: 'Rojo' },
                          { value: '#1E88E5', label: 'Azul' },
                          { value: '#43A047', label: 'Verde' },
                          { value: '#FDD835', label: 'Amarillo' },
                          { value: '#8E24AA', label: 'Morado' },
                          { value: '#FB8C00', label: 'Naranja' },
                        ]}
                      />
                      <SelectField
                        label="Estado"
                        name="estado_acta_id"
                        control={control}
                        options={datosIniciales?.combos?.estado_acta?.map(
                          (estado: any) => ({
                            value: estado.id,
                            label: estado.nombre,
                          })
                        )}
                        error={fieldErrors.estado_acta_id}
                      />
                    </div>
                    <MultiSelectField
                      label="Medida Cautelar"
                      name="medida_cautelar_id"
                      control={control}
                      options={datosIniciales?.combos?.estado_acta?.map(
                        (medida: any) => ({
                          value: medida.id,
                          label: medida.nombre,
                        })
                      )}
                      error={fieldErrors.medida_cautelar_id}
                    />

                  </div>
                </div>

                {/* SECCIÓN: Clasificación */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Clasificación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SelectField
                      label="Tipo de Acta"
                      name="tipo_id"
                      control={control}
                      options={datosIniciales?.combos?.tipos_acta?.map(
                        (tipo: any) => ({ value: tipo.id, label: tipo.nombre })
                      )}
                      error={fieldErrors.tipo_id}
                    />
                    <SelectField
                      label="Subtipo de Acta"
                      name="sub_tipo_id"
                      control={control}
                      options={datosIniciales?.combos?.sub_tipos?.map(
                        (sub: any) => ({
                          value: sub.id,
                          label: sub.nombre,
                        })
                      )}
                      error={fieldErrors.sub_tipo_id}
                    />
                    <SelectField
                      label="Ley"
                      name="ley_id"
                      control={control}
                      options={datosIniciales?.combos?.leyes?.map(
                        (ley: any) => ({
                          value: ley.id,
                          label: ley.nombre,
                        })
                      )}
                      error={fieldErrors.ley_id}
                    />
                    <SelectField
                      label="Oficina"
                      name="oficina_id"
                      control={control}
                      options={datosIniciales?.oficinas?.map(
                        (oficina: any) => ({
                          value: oficina.id,
                          label: oficina.descripcion,
                        })
                      )}
                      error={fieldErrors.oficina_id}
                    />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">
                    Juzgado y Secretaría
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <RHFInput
                      control={control}
                      name="secretaria_codigo"
                      label="Secretaria"
                      type="text"
                      disabled
                    />
                    <RHFInput
                      control={control}
                      name="secretaria_descripcion"
                      label="Secretaria"
                      type="text"
                      disabled
                    />
                    <RHFInput
                      control={control}
                      name="juez_codigo"
                      label="Juez"
                      type="text"
                      disabled
                    />
                    <RHFInput
                      control={control}
                      name="juez_nombre"
                      label="Juez"
                      type="text"
                      disabled
                    />
                    <RHFInput
                      control={control}
                      name="oficina_interna_codigo"
                      label="Oficina Interna"
                      type="text"
                      disabled
                    />
                    <RHFInput
                      control={control}
                      name="oficina_interna_descripcion"
                      label="Oficina Interna"
                      type="text"
                      disabled
                    />

                    <SelectField
                      label="Juez Subrogante"
                      name="juez_subrogante_id"
                      control={control}
                      options={datosIniciales?.combos?.jueces
                        ?.filter(
                          (juez: any) =>
                            juez.id === 3 || juez.id === 4
                        )
                        .map(
                          (juez: any) => ({
                            value: juez.id,
                            label: juez.nombre,
                          })
                        )}
                      error={fieldErrors.juez_subrogante_id}
                    />

                    <SelectField
                      label="Secretaria subrogante"
                      name="secretaria_subrogante_id"
                      control={control}
                      options={datosIniciales?.combos?.secretarias
                        ?.filter(
                          (secretaria: any) =>
                            secretaria.secretaria === 'Secretaria Subrogante'
                        )
                        .map((secretaria: any) => ({
                          value: secretaria.id,
                          label: secretaria.descripcion,
                        }))}
                      error={fieldErrors.secretaria_subrogante_id}
                    />

                  </div>
                </div>

                {/* SECCIÓN: Fechas */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Fechas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <RHFInput
                      control={control}
                      name="fecha_labrada"
                      label="Fecha Labrada"
                      type="date"
                    />
                    <RHFInput
                      control={control}
                      name="fecha_carga"
                      label="Fecha de Carga"
                      type="date"
                    />

                  </div>
                </div>

                {/* SECCIÓN: Ubicación */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Ubicación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <RHFInput control={control} name="lugar" label="Lugar" />
                    <SelectField
                      label="Calle"
                      name="calle_id"
                      control={control}
                      options={datosIniciales?.combos?.calles?.map(
                        (ley: any) => ({
                          value: ley.id,
                          label: ley.nombre,
                        })
                      )}
                      error={fieldErrors.calle_id}
                    />
                    <SelectField
                      label="Cruce de Calle"
                      name="cruce_id"
                      control={control}
                      options={datosIniciales?.combos?.calles?.map(
                        (ley: any) => ({
                          value: ley.id,
                          label: ley.nombre,
                        })
                      )}
                      error={fieldErrors.cruce_id}
                    />
                  </div>
                </div>

                {/* SECCIÓN: Inspectores */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">Inspectores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      label="Inspector"
                      name="inspector_1_id"
                      control={control}
                      options={datosIniciales?.combos?.inspectores?.map(
                        (inspector: any) => ({
                          value: inspector.id,
                          label: inspector.nombre,
                        })
                      )}
                      error={fieldErrors.inspector_1_id}
                    />
                    <SelectField
                      label="2° Inspector"
                      name="inspector_2_id"
                      control={control}
                      options={datosIniciales?.combos?.inspectores?.map(
                        (inspector: any) => ({
                          value: inspector.id,
                          label: inspector.nombre,
                        })
                      )}
                      error={fieldErrors.inspector_2_id}
                    />
                  </div>
                </div>

                {/* SECCIÓN: Tabs de Involucrados */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <ActaTabsForm
                    control={control}
                    infractores={datosIniciales?.combos?.infractores}
                    padrones={datosIniciales?.combos?.padrones}
                    infracciones={datosIniciales?.combos?.infracciones}
                  />
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex justify-end gap-4 mb-6">

                  {/* <button
                    type="button"
                    onClick={() => reset(acta)}
                    className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-semibold"
                  >
                    Descartar Cambios
                  </button> */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'movimientos' && (
              <MovimientosTab
                actaId={id}
                oficinas={datosIniciales?.combos?.oficinas_internas || []}
                setIsLoadingGlobal={setIsLoading}
              />
            )}

            {activeTab === 'estados' && (
              <EstadoProcesalTab actaId={id} />
            )}

            {activeTab === 'pruebas' && (
              <PruebasTab actaId={id} />
            )}

            {activeTab === 'grupo' && (
              <GrupoTab actaId={acta.id} grupo={acta.grupo} />
            )}
          </form>
        </>
      ) : (
        <div className="text-center text-gray-500">No se encontró el acta</div>
      )}
    </Container>
  )
}
