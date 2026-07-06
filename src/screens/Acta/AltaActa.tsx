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
import {
  ButtonBase,
  Container,
  FormFooter,
  FormSection,
  RHFInput,
} from '@nqnmodernizacion/muni-ui'
import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

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
  estado_acta_id?: number
  fecha_notificado?: string
  desestimada?: number
  color?: string
  caratula?: string
  observacion?: string
  inspector_1_id?: number
  inspector_2_id?: number
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
    },
    // resolver: yupResolver(AltaActaSchema),
  })

  const selectedOfficeId = watch('oficina_id') as string | number | undefined

  const inspectorOptions = useMemo(() => {
    const inspectors: any[] = datosIniciales?.combos?.inspectores ?? []
    const result: { value: any; label: string }[] = []
    const noFilter =
      selectedOfficeId === undefined || selectedOfficeId === ''

    for (const inspector of inspectors) {
      if (
        noFilter ||
        String(inspector.oficina_id) === String(selectedOfficeId)
      ) {
        result.push({ value: inspector.id, label: inspector.nombre })
      }
    }
    return result
  }, [datosIniciales?.combos?.inspectores, selectedOfficeId])

  const opciones = useMemo(() => {
    const mapOptions = (items: any[] = []) =>
      items.map((it) => ({ value: it.id, label: it.nombre ?? it.descripcion }))

    return {
      oficinas: mapOptions(datosIniciales?.oficinas),
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

  return (
    <Container
      linkBack="#/"
      title="Alta de Actas"
      subtitle=""
      className="space-y-6"
      backIcon={<ChevronLeft className="size-4 shrink-0 text-primary-700" />}
      backLabel="Volver"
    >
      {isLoading ? (
        <MuniSpinner file="muniexpress.svg" />
      ) : (
        <form
          className="mt-2"
          onSubmit={handleSubmit(
            // (formData) => console.log('formData', formData)
            (formData) => onSubmitAlta(formData, setIsLoading, nav)
          )}
        >
          {/* SECCIÓN DE ACTA */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
            {/* LADO IZQUIERDO */}
            <FormSection fullWidth className="p-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <RHFInput control={control} name="year" label="Año de Acta" />

                <RHFInput
                  control={control}
                  name="numero_acta"
                  label="Número de Acta"
                />
              </div>

              <div className="mt-2">
                <RHFInput control={control} name="caratula" label="Carátula" />
              </div>

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
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                // value={new Date().toISOString().split("T")[0]} // Establece la fecha actual como valor por defecto
                />
              </div>

              <SelectField
                label="Tipo de Acta"
                name="tipo_id"
                control={control}
                options={opciones.tiposActa}
                error={errors.tipo_id}
              />
              <SelectField
                label="Subtipo de Acta"
                name="sub_tipo_id"
                control={control}
                options={opciones.subTipos}
                error={errors.sub_tipo_id}
              />
              <SelectField
                label="Ley"
                name="ley_id"
                control={control}
                options={opciones.leyes}
                error={errors.ley_id}
              />
              
            </FormSection>

            {/* LADO DERECHO */}
            <FormSection fullWidth className="p-2">

              
              <MultiSelectField
                label="Medida Cautelar"
                name="medida_cautelar_id"
                control={control}
                options={opciones.medidasCautelares}
                error={errors.medida_cautelar_id}
              />

              <RHFInput control={control} name="lugar" label="Lugar" />
              <SelectField
                label="Calle"
                name="calle_id"
                control={control}
                options={opciones.calles}
                error={errors.calle_id}
              />

              <SelectField
                label="Cruce de Calles"
                name="cruce_id"
                control={control}
                options={opciones.calles}
                error={errors.cruce_id}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ColorSelect
                  label="Color"
                  name="color"
                  control={control}
                  options={COLOR_OPTIONS}
                />

                <SelectField
                  label="Estado"
                  name="estado_acta_id"
                  control={control}
                  options={opciones.estadosActa}
                  error={errors.estado_acta_id}
                />
              </div>


              <div className="mt-2">
                <Controller
                  control={control}
                  name="observacion"
                  render={({ field }) => (
                    <div>
                      <label className="mx-label">Observación</label>
                      <textarea
                        {...field}
                        className="w-full border rounded-lg px-3 py-2"
                        rows={4}
                      />
                    </div>
                  )}
                />
              </div>

            </FormSection>
          </div>

          {/* SECCIÓN DE INSPECTORES */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* LADO IZQUIERDO */}
            <FormSection fullWidth className="p-2">
              <SelectField
                label="Inspector"
                name="inspector_1_id"
                control={control}
                options={inspectorOptions}
                error={errors.inspector_1_id}
              />
            </FormSection>

            {/* LADO DERECHO */}
            <FormSection fullWidth className="p-2">
              <SelectField
                label="2° Inspector"
                name="inspector_2_id"
                control={control}
                options={inspectorOptions}
                error={errors.inspector_2_id}
              />
            </FormSection>
          </div>

          <FormSection fullWidth className="p-2 mt-2">
            <ActaTabsForm
              control={control}
              errors={errors}
              infractores={datosIniciales?.combos?.infractores}
              padrones={datosIniciales?.combos?.padrones}
              infracciones={datosIniciales?.combos?.infracciones}
            />
          </FormSection>

          <FormFooter>
            <ButtonBase type="submit" color="primary" isLoading={isSubmitting}>
              Grabar Acta
            </ButtonBase>
          </FormFooter>

        </form>
      )}
    </Container>
  )
}
