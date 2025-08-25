import { useForm } from 'react-hook-form'

import FormFooter from '@/components/FormFooter'
import { prioridades } from '../exampleData'
import useOpciones from '@/hooks/useOptions'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../../schemas/ExampleSchema'
import SelectSearch from '@/components/Inputs/SelectSearch'
import FormSection from '@/components/FormSection'
import CheckInline from '@/components/CheckInline'
import Input from '@/components/Inputs/Input'
import Select from '@/components/Inputs/Select'

const FormView = ({ onCancel }) => {
  const {
    handleSubmit,
    control,
    formState: { isLoading },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const optionsPropiedades = useOpciones(
    prioridades,
    (item) => `${item.label}`,
    'Seleccione una prioridad'
  )

  const onSubmit = async (form: any) => {
    console.log(form)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <FormSection>
        <Input
          control={control}
          name="asunto"
          label="Asunto"
          smallText="Este es un texto de ayuda"
        />

        <Input control={control} name="asunto2" label="Asunto" type="date" />

        <Select
          control={control}
          name="prioridad_id"
          label="Selec Comun"
          options={optionsPropiedades}
        />

        <SelectSearch
          control={control}
          name="prioridad"
          label="SelectSearch Multi"
          options={optionsPropiedades}
          isMulti
        />

        <SelectSearch
          control={control}
          name="prioridad2"
          label="SelectSearch Simple"
          options={optionsPropiedades}
        />

        <CheckInline
          control={control}
          name="envio_email"
          label="Enviar email"
          classNames={{
            container: 'pt-8',
          }}
        />
      </FormSection>

      <FormFooter
        submitButtonText="Guardar"
        isSubmitting={isLoading}
        onCancel={onCancel}
      />
    </form>
  )
}

export default FormView
