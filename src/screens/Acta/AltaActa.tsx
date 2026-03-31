import { SelectField } from "@/components/Forms/SelectField";
import ChevronLeft from "@/components/Svgs/ChevronLeft"
import { onSubmitAlta } from "@/services/ActaService";
import { ButtonBase, Container, FormFooter, FormSection, RHFInput, SelectBase } from "muni-ui"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type FormValues = { email: string };

const opciones = [
    { value: "1", label: "Si" },
    { value: "0", label: "No" },
];

export const AltaActa = () => {

    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        // resolver: yupResolver(AltaVehiculoSchema),
    });

    return (

        <Container
            linkBack="#/"
            title="Alta de Actas"
            subtitle=""
            className="space-y-6"
            backIcon={<ChevronLeft className="size-4 shrink-0 text-primary-700" />}
            backLabel="Volver"
        >
            <form className="mt-2"
                onSubmit={handleSubmit(
                    (formData) => onSubmitAlta(formData, setIsLoading, nav)
                )}
            >
                {/* SECCIÓN DE ACTA */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">

                    {/* LADO DERECHO */}
                    <FormSection fullWidth className="p-2">

                        <RHFInput
                            control={control}
                            name="anio_acta"
                            label="Año de la Acta"
                        />
                        <RHFInput
                            control={control}
                            name="oficina"
                            label="Oficina"
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                            <RHFInput
                                control={control}
                                name="fecha_labrada"
                                label="Fecha Labrada"
                            />
                            <RHFInput
                                control={control}
                                name="fecha_carga"
                                label="Fecha de Carga"
                            />
                        </div>

                        <RHFInput
                            control={control}
                            name="tipo"
                            label="Tipo"
                        />
                        <RHFInput
                            control={control}
                            name="subtipo"
                            label="Subtipo"
                        />
                        <RHFInput
                            control={control}
                            name="ley"
                            label="Ley"
                        />

                    </FormSection>

                    {/* LADO IZQUIERDO */}
                    <FormSection fullWidth className="p-2">

                        <RHFInput
                            control={control}
                            name="lugar"
                            label="Lugar"
                        />
                        <RHFInput
                            control={control}
                            name="codigo_calle"
                            label="Código de la Calle"
                        />
                        <RHFInput
                            control={control}
                            name="cruce_calle"
                            label="Cruce de Calles"
                        />
                        <RHFInput
                            control={control}
                            name="estado"
                            label="Estado"
                        />
                        <RHFInput
                            control={control}
                            name="fecha_estado"
                            label="Fecha del Estado"
                        />
                        <RHFInput
                            control={control}
                            name="fecha_notificado"
                            label="Fecha Notificado"
                        />

                        {/* <SelectField
                            label="Desestimada"
                            control={register("es_gas", { disabled: formPending })}
                            options={opcionesEquipoGas?.map((m: any) => ({ value: m.id, label: m.label }))}
                            error={errors.es_gas}
                        /> */}

                        <SelectBase
                            control={control}
                            label="desestimada"
                            options={opciones}
                        />

                    </FormSection>

                </div>

                {/* SECCIÓN DE INSPECTORES */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* LADO DERECHO */}
                    <FormSection fullWidth className="p-2">


                        <RHFInput
                            control={control}
                            name="codigo_inspector"
                            label="Codigo Inspector"
                        />
                        <RHFInput
                            control={control}
                            name="apellido_inspector"
                            label="Apellido Inspector"
                        />
                        <RHFInput
                            control={control}
                            name="nombre_inspector"
                            label="Nombre Inspector"
                        />

                    </FormSection>

                    {/* LADO IZQUIERDO */}
                    <FormSection fullWidth className="p-2">

                        <RHFInput
                            control={control}
                            name="codigo_inspector2"
                            label="2° Inspector"
                        />
                        <RHFInput
                            control={control}
                            name="apellido_inspector2"
                            label="Apellido Inspector"
                        />
                        <RHFInput
                            control={control}
                            name="nombre_inspector2"
                            label="Nombre Inspector"
                        />

                    </FormSection>

                </div>

                <FormFooter>
                    <ButtonBase
                        type="submit"
                        color="primary"
                        isLoading={isSubmitting}
                    >
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


        </Container>

    )
}
