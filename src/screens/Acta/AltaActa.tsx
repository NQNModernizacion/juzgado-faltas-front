import ActaTabsForm from "@/components/ActaTabs";
import { SelectField } from "@/components/Forms/SelectField";
import ChevronLeft from "@/components/Svgs/ChevronLeft"
import { AltaActaSchema } from "@/schemas/AltaActaSchema";
import { onSubmitAlta } from "@/services/ActaService";
import { yupResolver } from "@hookform/resolvers/yup";
import { ButtonBase, Container, FormFooter, FormSection, RHFInput, SelectBase } from "muni-ui"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface Row {
    tipo: string;
    identificacion: string;
    nombre: string;
    documento: string;
}

interface FormValues {
    fecha_carga: string;
    Padrones: Row[];
    Infractores: Row[];
    Infracciones: Row[];
    anio_acta?: string;
    numero_acta?: string;
    oficina?: number;
    fecha_labrada?: string;
    tipo_acta?: number;
    subtipo_acta?: number;
    ley?: number;
    lugar?: string;
    calle?: number;
    cruce_calle?: string;
    estado?: number;
    fecha_notificado?: string;
    desestimada?: number;
    inspector?: number;
    inspector2?: number;
}

const opciones = [
    { value: "1", label: "Si" },
    { value: "0", label: "No" },
];

const createEmptyRows = () =>
    Array.from({ length: 5 }, () => ({
        tipo: "",
        identificacion: "",
        nombre: "",
        documento: "",
    }));

export const AltaActa = () => {

    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            fecha_carga: new Date().toISOString().split("T")[0],
            Padrones: createEmptyRows(),
            Infractores: createEmptyRows(),
            Infracciones: createEmptyRows(),
        },
        resolver: yupResolver(AltaActaSchema),
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

                    {/* LADO IZQUIERDO */}
                    <FormSection fullWidth className="p-2">

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                            <RHFInput
                                control={control}
                                name="anio_acta"
                                label="Año de Acta"
                            />

                            <RHFInput
                                control={control}
                                name="numero_acta"
                                label="Número de Acta"
                            />
                        </div>

                        <SelectField
                            label="Oficina"
                            name="oficina"
                            control={control}
                            options={[
                                { value: 1, label: "Transito" },
                                { value: 2, label: "Comercio" },
                            ]}
                            error={errors.oficina}
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
                            name="tipo_acta"
                            control={control}
                            options={[
                                { value: 1, label: "Limpieza Urbana" },
                                { value: 2, label: "Transporte" },
                                { value: 3, label: "Otro" },
                            ]}
                            error={errors.tipo_acta}
                        />
                        <SelectField
                            label="Subtipo de Acta"
                            name="subtipo_acta"
                            control={control}
                            options={[
                                { value: 1, label: "Centro Carga Acta" },
                                { value: 2, label: "Tribunal Faltas" },
                            ]}
                            error={errors.subtipo_acta}
                        />
                        <SelectField
                            label="Ley"
                            name="ley"
                            control={control}
                            options={[
                                { value: 1, label: "Ordenanza 8833" },
                                { value: 2, label: "Ley 12018" },
                            ]}
                            error={errors.subtipo_acta}
                        />

                    </FormSection>

                    {/* LADO DERECHO */}
                    <FormSection fullWidth className="p-2">

                        <RHFInput
                            control={control}
                            name="lugar"
                            label="Lugar"
                        />
                        <SelectField
                            label="Calle"
                            name="calle"
                            control={control}
                            options={[
                                { value: 1, label: "Calle 1" },
                                { value: 2, label: "Calle 2" },
                            ]}
                            error={errors.subtipo_acta}
                        />
                        {/* <RHFInput
                            control={control}
                            name="codigo_calle"
                            label="Código de la Calle"
                        /> */}
                        <RHFInput
                            control={control}
                            name="cruce_calle"
                            label="Cruce de Calles"
                        />

                        <SelectField
                            label="Estado"
                            name="estado"
                            control={control}
                            options={[
                                { value: 1, label: "Baja" },
                                { value: 2, label: "Genero Causa" },
                                { value: 3, label: "Notificado" },
                            ]}
                            error={errors.estado}
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
                                    { value: 1, label: "Si" },
                                    { value: 2, label: "No" },
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
                            name="inspector"
                            control={control}
                            options={[
                                { value: 1, label: "Comercio" },
                            ]}
                            error={errors.inspector}
                        />

                    </FormSection>

                    {/* LADO DERECHO */}
                    <FormSection fullWidth className="p-2">

                        <SelectField
                            label="2° Inspector"
                            name="inspector2"
                            control={control}
                            options={[
                                { value: 1, label: "Comercio" },
                            ]}
                            error={errors.inspector2}
                        />

                    </FormSection>

                </div>

                <FormSection fullWidth className="p-2 mt-2">

                    <ActaTabsForm control={control} />
                </FormSection>

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
