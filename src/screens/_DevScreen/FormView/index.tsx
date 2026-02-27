import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../../../schemas/ExampleSchema";

// import FormFooter from "@/components/FormFooter";
// import FormSection from "@/components/FormSection";

import useOpciones from "@/hooks/useOptions";
import { prioridades } from "../exampleData";

import { FormFooter, FormSection, RHFCheckbox, RHFInput, RHFSelect, RHFSelectSearch } from "muni-ui";

const FormView = ({ onCancel }) => {
  const {
    handleSubmit,
    control,
    formState: { isLoading },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      asunto: "",
      asunto2: "",
      prioridad_id: "",
      prioridad: [],     // multi
      prioridad2: "",    // single
    },
  });

  const optionsPropiedades = useOpciones(
    prioridades,
    (item) => `${item.label}`,
    "Seleccione una prioridad"
  );

  const onSubmit = async (form: any) => console.log(form);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <FormSection>
        <RHFInput
          control={control}
          name="asunto"
          label="Asunto"
          helperText="Este es un texto de ayuda"
        />

        <RHFInput control={control} name="asunto2" label="Asunto" type="date" />

        {/* Select nativo */}
        <RHFSelect
          control={control}
          name="prioridad_id"
          label="Selec Común"
          options={optionsPropiedades}
          placeholder="Seleccione una prioridad"
        />

        {/* SelectSearch Multi (react-select) */}
        <RHFSelectSearch
          control={control}
          name="prioridad"
          label="SelectSearch Multi"
          options={optionsPropiedades}
          isMulti
        />

        {/* SelectSearch Simple */}
        <RHFSelectSearch
          control={control}
          name="prioridad2"
          label="SelectSearch Simple"
          options={optionsPropiedades}
        />

        <RHFCheckbox control={control} name="envio_email" label="Enviar email" />

      </FormSection>

      <FormFooter
        submitButtonText="Guardar"
        isSubmitting={isLoading}
        onCancel={onCancel}
      />
    </form>
  );
};

export default FormView;
