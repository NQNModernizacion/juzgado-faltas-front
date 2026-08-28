import ActaTabsForm from '@/components/ActaTabs'
import { SelectField } from '@/components/Forms/SelectField'
import { MultiSelectField } from '@/components/Forms/MultiSelectField'
import ColorSelect from '@/components/Forms/ColorSelect'
import MuniSpinner from '@/components/MuniSpinner'
import { COLOR_OPTIONS } from '@/config/actaOptions'
import ChevronLeft from '@/components/Svgs/ChevronLeft'
import { AltaActaSchema } from '@/schemas/AltaActaSchema'
import { getDatosInicialesActa, onSubmitAlta } from '@/services/ActaService'
import { yupResolver } from '@hookform/resolvers/yup'
import { ButtonBase, FormFooter, RHFInput } from '@nqnmodernizacion/muni-ui'
import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { DenseContainer } from '@/components/Layouts/DenseContainer'

interface Row {
  tipo_id: string
  identificacion: string
  nombre: string
  documento: string
  observacion: string
}

interface FormValues {
  fecha_carga: string
  Padrones: Row[]
  Infractores: Row[]
  Infracciones: Row[]
  year?: string
  numero_acta?: string
  oficina_id?: number
  fecha_labrada?: string
  tipo_id?: number
  sub_tipo_id?: number
  ley_id?: number
  medida_cautelar_id?: number[]
  lugar?: string
  calle_id?: number
  cruce_id?: string
  fecha_notificado?: string
  desestimada?: number
  color?: string
  caratula?: string
  observacion?: string
  inspector_1_id?: number
  inspector_2_id?: number
  oficina_destino_id?: number
}

const createEmptyRows = () =>
  Array.from({ length: 1 }, () => ({
    tipo_id: '',
    identificacion: '',
    nombre: '',
    documento: '',
  }))

export const AltaActa = () => {
  const [isLoading, setIsLoading] = useState(false)
  const nav = useNavigate()
  const [datosIniciales, setDatosIniciales] = useState<any>(null)
  const [estadoActaVisual, setEstadoActaVisual] = useState<string | number | undefined>(undefined)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      fecha_carga: new Date().toISOString().split('T')[0],
      fecha_notificado: new Date().toISOString().split('T')[0],
      year: new Date().getFullYear().toString(),
      Padrones: createEmptyRows(),
      Infractores: createEmptyRows(),
      Infracciones: createEmptyRows(),
      color: undefined,
      caratula: '',
      oficina_id: undefined,
      inspector_1_id: undefined,
      inspector_2_id: undefined,
      oficina_destino_id: undefined,
    },
    resolver: yupResolver(AltaActaSchema),
  })

  const selectedOfficeId = watch('oficina_id') as string | number | undefined

  const inspectorOptions = useMemo(() => {
    const inspectors: any[] = datosIniciales?.combos?.inspectores ?? []
    const result: { value: any; label: string }[] = []
    const noFilter = selectedOfficeId === undefined || selectedOfficeId === ''

    for (const inspector of inspectors) {
      if (noFilter || String(inspector.oficina_id) === String(selectedOfficeId)) {
        result.push({ value: inspector.id, label: inspector.nombre })
      }
    }
    return result
  }, [datosIniciales?.combos?.inspectores, selectedOfficeId])

  const opciones = useMemo(() => {
    const mapOptions = (items: any[] = []) => items.map((it) => ({ value: it.id, label: it.nombre ?? it.descripcion }))

    return {
      oficinas: mapOptions(datosIniciales?.oficinas),
      oficinasInternas: mapOptions(datosIniciales?.combos?.oficinas_internas),
      tiposActa: mapOptions(datosIniciales?.combos?.tipos_acta),
      subTipos: mapOptions(datosIniciales?.combos?.sub_tipos),
      leyes: mapOptions(datosIniciales?.combos?.leyes),
      medidasCautelares: mapOptions(datosIniciales?.combos?.medida_cautelar_acta),
      calles: mapOptions(datosIniciales?.combos?.calles),
      estadosActa: mapOptions(datosIniciales?.combos?.estados_procesales),
    }
  }, [datosIniciales])

  useEffect(() => {
    getDatosInicialesActa(setIsLoading, setDatosIniciales)
  }, [])

  useEffect(() => {
    if (estadoActaVisual === undefined && opciones.estadosActa.length > 0) {
      setEstadoActaVisual(opciones.estadosActa[0]?.value)
    }
  }, [opciones.estadosActa, estadoActaVisual])

  return (
    <DenseContainer linkBack="#/" title="Alta de Actas" containerClassName="p-1 sm:p-1 space-y-2">
      {isLoading ? (
        <MuniSpinner file="muniexpress.svg" />
      ) : (
        <form
          className="w-full mx-auto"
          onSubmit={handleSubmit(
            // (formData) => console.log('formData', formData)
            (formData) => onSubmitAlta(formData, setIsLoading, nav)
          )}
        >
          {/* SECCIÓN SUPERIOR: DATOS GENERALES Y UBICACIÓN LADO A LADO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-1">
            {/* COLUMNA IZQUIERDA: DATOS DE LA CAUSA */}
            <div className="mx-section p-1 px-2 bg-white">
              <h3 className="text-xs font-bold text-primary-400 border-b">Datos de la Causa</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-1 mt-1">
                <RHFInput control={control} name="year" label="Año de Acta" containerClassName="md:col-span-2" />
                <RHFInput control={control} name="numero_acta" label="Número de Acta" containerClassName="md:col-span-2" />
                <SelectField
                  label="Oficina"
                  name="oficina_id"
                  control={control}
                  options={opciones.oficinas}
                  error={errors.oficina_id}
                  onChange={() => {
                    setValue('inspector_1_id', undefined)
                    setValue('inspector_2_id', undefined)
                  }}
                  containerClassName="md:col-span-2"
                />
                <RHFInput control={control} name="caratula" label="Carátula" containerClassName="md:col-span-6" />

                <RHFInput control={control} name="fecha_labrada" label="Fecha Labrada" type="date" containerClassName="md:col-span-3" />
                <RHFInput control={control} name="fecha_carga" label="Fecha de Carga" type="date" containerClassName="md:col-span-3" />

                <SelectField label="Tipo de Acta" name="tipo_id" control={control} options={opciones.tiposActa} error={errors.tipo_id} containerClassName="md:col-span-2" />
                <SelectField label="Subtipo de Acta" name="sub_tipo_id" control={control} options={opciones.subTipos} error={errors.sub_tipo_id} containerClassName="md:col-span-2" />
                <SelectField label="Ley" name="ley_id" control={control} options={opciones.leyes} error={errors.ley_id} containerClassName="md:col-span-2" />

                <SelectField label="Inspector" name="inspector_1_id" control={control} options={inspectorOptions} error={errors.inspector_1_id} containerClassName="md:col-span-3" />
                <SelectField label="2° Inspector" name="inspector_2_id" control={control} options={inspectorOptions} error={errors.inspector_2_id} containerClassName="md:col-span-3" />

                <MultiSelectField
                  label="Medida Cautelar"
                  name="medida_cautelar_id"
                  control={control}
                  options={opciones.medidasCautelares}
                  error={errors.medida_cautelar_id}
                  containerClassName="md:col-span-3"
                />

                <ColorSelect label="Color" name="color" control={control} options={COLOR_OPTIONS} containerClassName="md:col-span-3" />
              </div>
            </div>

            {/* COLUMNA DERECHA: UBICACIÓN, DETALLES E INSPECTORES */}
            <div className="mx-section p-1 px-2 bg-white">
              <h3 className="text-xs font-bold text-primary-400 border-b">Ubicación y Detalles</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-1">
                <RHFInput control={control} name="lugar" label="Lugar" containerClassName="col-span-4" />

                <SelectField label="Calle" name="calle_id" control={control} options={opciones.calles} error={errors.calle_id} containerClassName="col-span-2" />

                <SelectField label="Cruce de Calles" name="cruce_id" control={control} options={opciones.calles} error={errors.cruce_id} containerClassName="col-span-2" />

                <SelectField
                  label="Ubicación (Destino)"
                  name="oficina_destino_id"
                  control={control}
                  options={opciones.oficinasInternas}
                  error={errors.oficina_destino_id}
                  containerClassName="col-span-2"
                />
                <div className="w-full col-span-2">
                  <label className="mx-label">Estado</label>
                  <select className="mx-select" disabled value={estadoActaVisual ?? ''} onChange={() => {}}>
                    <option value="">Seleccione una opción</option>
                    {opciones.estadosActa?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <RHFInput control={control} name="fecha_notificado" label="Fecha Notificado" type="date" containerClassName="col-span-2" />

                <SelectField
                  label="Desestimada"
                  name="desestimada"
                  containerClassName="col-span-2"
                  control={control}
                  options={[
                    { value: 0, label: 'No' },
                    { value: 1, label: 'Sí' },
                  ]}
                  error={errors.desestimada}
                />
                <div className="md:col-span-4">
                  <Controller
                    control={control}
                    name="observacion"
                    render={({ field }) => (
                      <div>
                        <label className="mx-label">Observación</label>
                        <textarea {...field} className="w-full border rounded-lg px-2 py-1 text-xs" rows={2} />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN INFERIOR: INVOLUCRADOS (TABLAS AL 100%) */}
          <div className="w-full">
            <ActaTabsForm
              control={control}
              errors={errors}
              infractores={datosIniciales?.combos?.infractores}
              padrones={datosIniciales?.combos?.padrones}
              infracciones={datosIniciales?.combos?.infracciones}
            />
          </div>

          <FormFooter>
            <ButtonBase type="submit" color="primary" isLoading={isSubmitting}>
              Grabar Acta
            </ButtonBase>
          </FormFooter>
        </form>
      )}
    </DenseContainer>
  )
}
