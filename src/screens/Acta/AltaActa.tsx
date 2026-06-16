import ActaTabsForm from '@/components/ActaTabs'
import { SelectField } from '@/components/Forms/SelectField'
import ColorSelect from '@/components/Forms/ColorSelect'
import MuniSpinner from '@/components/MuniSpinner'
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
  SelectBase,
} from '@nqnmodernizacion/muni-ui'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

interface Row {
  tipo_id: string
  identificacion: string
  nombre: string
  documento: string
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
  lugar?: string
  calle_id?: number
  cruce_id?: string
  estado_acta_id?: number
  fecha_notificado?: string
  desestimada?: number
  color?: string
  caratula?: string
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
    const inspectors = datosIniciales?.combos?.inspectores ?? []

    if (selectedOfficeId === undefined || selectedOfficeId === '') {
      return inspectors.map((inspector: any) => ({
        value: inspector.id,
        label: inspector.nombre,
      }))
    }

    return inspectors
      .filter(
        (inspector: any) =>
          String(inspector.oficina_id) === String(selectedOfficeId)
      )
      .map((inspector: any) => ({
        value: inspector.id,
        label: inspector.nombre,
      }))
  }, [datosIniciales?.combos?.inspectores, selectedOfficeId])

  useEffect(() => {
    if (selectedOfficeId !== undefined) {
      setValue('inspector_1_id', undefined)
      setValue('inspector_2_id', undefined)
    }
  }, [selectedOfficeId, setValue])

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
                options={datosIniciales?.oficinas?.map((oficina: any) => ({
                  value: oficina.id,
                  label: oficina.descripcion,
                }))}
                // options={[
                //     { value: 1, label: "Transito" },
                //     { value: 2, label: "Comercio" },
                // ]}
                error={errors.oficina_id}
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
                options={datosIniciales?.combos?.tipos_acta?.map(
                  (tipo: any) => ({ value: tipo.id, label: tipo.nombre })
                )}
                // options={[
                //     { value: 1, label: "Limpieza Urbana" },
                //     { value: 2, label: "Transporte" },
                //     { value: 3, label: "Otro" },
                // ]}
                error={errors.tipo_id}
              />
              <SelectField
                label="Subtipo de Acta"
                name="sub_tipo_id"
                control={control}
                options={datosIniciales?.combos?.sub_tipos?.map((sub: any) => ({
                  value: sub.id,
                  label: sub.nombre,
                }))}
                // options={[
                //     { value: 1, label: "Centro Carga Acta" },
                //     { value: 2, label: "Tribunal Faltas" },
                // ]}
                error={errors.sub_tipo_id}
              />
              <SelectField
                label="Ley"
                name="ley_id"
                control={control}
                options={datosIniciales?.combos?.leyes?.map((ley: any) => ({
                  value: ley.id,
                  label: ley.nombre,
                }))}
                // options={[
                //     { value: 1, label: "Ordenanza 8833" },
                //     { value: 2, label: "Ley 12018" },
                // ]}
                error={errors.ley_id}
              />
            </FormSection>

            {/* LADO DERECHO */}
            <FormSection fullWidth className="p-2">
              <RHFInput control={control} name="lugar" label="Lugar" />
              <SelectField
                label="Calle"
                name="calle_id"
                control={control}
                options={datosIniciales?.combos?.calles?.map((calle: any) => ({
                  value: calle.id,
                  label: calle.nombre,
                }))}
                // options={[
                //   { value: 1, label: 'Calle 1' },
                //   { value: 2, label: 'Calle 2' },
                // ]}
                error={errors.calle_id}
              />
              {/* <RHFInput
                            control={control}
                            name="codigo_calle"
                            label="Código de la Calle"
                        /> */}
              <SelectField
                label="Cruce de Calles"
                name="cruce_id"
                control={control}
                options={datosIniciales?.combos?.calles?.map((calle: any) => ({
                  value: calle.id,
                  label: calle.nombre,
                }))}
                error={errors.cruce_id}
              />

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
                options={[
                  { value: 1, label: 'Baja' },
                  { value: 2, label: 'Genero Causa' },
                  { value: 3, label: 'Notificado' },
                ]}
                error={errors.estado_acta_id}
              />
              {/* <RHFInput
                            control={control}
                            name="estado"
                            label="Estado"
                        /> */}
              {/* <RHFInput
                            control={control}
                            name="fecha_estado"
                            label="Fecha del Estado"
                            type="date"
                        /> */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <RHFInput
                  control={control}
                  name="fecha_notificado"
                  label="Fecha Notificado"
                  type="date"
                />

                <SelectField
                  label="Desestimada"
                  name="desestimada"
                  control={control}
                  options={[
                    { value: 1, label: 'Si' },
                    { value: 2, label: 'No' },
                  ]}
                  error={errors.desestimada}
                />
              </div>

              {/* <SelectField
                            label="Desestimada"
                            control={control}
                            options={opciones}
                        // error={errors.es_desestimada}
                        /> */}

              {/* <SelectBase
                            control={control}
                            label="desestimada"
                            options={opciones}
                        /> */}
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

          {/* <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full md:w-auto px-6 py-2 rounded-md font-semibold text-white bg-blue-800 hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {"Grabar Acta"}

                    </button>

                </div> */}
        </form>
      )}
    </Container>
  )
}
