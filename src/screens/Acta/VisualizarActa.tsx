import MuniSpinner from "@/components/MuniSpinner";
import { getActa, getDatosInicialesActa } from "@/services/ActaService";
import { Container, RHFInput } from "muni-ui"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { SelectField } from "@/components/Forms/SelectField";

export const VisualizarActa = () => {

    const { id } = useParams();
    const [acta, setActa] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [datosIniciales, setDatosIniciales] = useState<any>(null);

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {}
    });

    const { fields: infractoresFields, append: appendInfractor, remove: removeInfractor } = useFieldArray({
        control,
        name: "Infractores"
    });
    const { fields: patronesFields, append: appendPadron, remove: removePadron } = useFieldArray({
        control,
        name: "Padrones"
    });
    const { fields: infraccionesFields, append: appendInfraccion, remove: removeInfraccion } = useFieldArray({
        control,
        name: "Infracciones"
    });

    useEffect(() => {
        getActa(id, setActa, setIsLoading);
        getDatosInicialesActa(setIsLoading, setDatosIniciales);
    }, [id])

    useEffect(() => {
        if (acta) {
            const formatDate = (value: any) => {
                if (!value) return "";
                const date = value instanceof Date ? value : new Date(value);
                return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
            };

            reset({
                ...acta,
                fecha_labrada: formatDate(acta.fecha_labrada),
                fecha_carga: formatDate(acta.fecha_carga),
                fecha_notificado: formatDate(acta.fecha_notificado),
                juzgado: acta.juzgado ? acta.juzgado.descripcion : "",
            });
        }
    }, [acta, reset])

    const onSubmit = (data: any) => {
        console.log("Acta modificada:", data);
        // Aquí irá la lógica para guardar los cambios
    }

    return (
        <Container title={'Visualizar Acta'} linkBack="#/acta/listado">
            {isLoading ? (
                <MuniSpinner />
            ) : acta ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* SECCIÓN: Información Básica */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold mb-4">Información Básica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <RHFInput
                                control={control}
                                name="year"
                                label="Año del Acta"
                            />
                            <RHFInput
                                control={control}
                                name="numero_acta"
                                label="Número del Acta"
                            />
                            <RHFInput
                                control={control}
                                name="juzgado"
                                label="Juzgado"
                                disabled
                            />
                            <SelectField
                                label="Oficina"
                                name="oficina_id"
                                control={control}
                                options={
                                    datosIniciales?.oficinas?.map((oficina: any) =>
                                        ({ value: oficina.id, label: oficina.descripcion }))
                                }
                                error={errors.oficina_id}
                            />
                            <SelectField
                                label="Estado"
                                name="estado_acta_id"
                                control={control}
                                options={[
                                    { value: 1, label: "Baja" },
                                    { value: 2, label: "Genero Causa" },
                                    { value: 3, label: "Notificado" },
                                ]}
                                error={errors.estado_acta_id}
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
                                options={
                                    datosIniciales?.combos?.tipos_acta?.map((tipo: any) =>
                                        ({ value: tipo.id, label: tipo.nombre }))
                                }
                                error={errors.tipo_id}
                            />
                            <SelectField
                                label="Subtipo de Acta"
                                name="sub_tipo_id"
                                control={control}
                                options={
                                    datosIniciales?.combos?.sub_tipos?.map((sub: any) =>
                                        ({ value: sub.id, label: sub.nombre }))
                                }
                                error={errors.sub_tipo_id}
                            />
                            <SelectField
                                label="Ley"
                                name="ley_id"
                                control={control}
                                options={
                                    datosIniciales?.combos?.leyes?.map((ley: any) =>
                                        ({ value: ley.id, label: ley.nombre }))
                                }
                                error={errors.ley_id}
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
                            <RHFInput
                                control={control}
                                name="fecha_notificado"
                                label="Fecha Notificado"
                                type="date"
                            />
                        </div>
                    </div>

                    {/* SECCIÓN: Ubicación */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold mb-4">Ubicación</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <RHFInput
                                control={control}
                                name="lugar"
                                label="Lugar"
                            />
                            <SelectField
                                label="Calle"
                                name="calle_id"
                                control={control}
                                  options={
                                    datosIniciales?.combos?.calles?.map((ley: any) =>
                                        ({ value: ley.id, label: ley.nombre }))
                                }
                                error={errors.calle_id}
                            />
                            <SelectField
                                label="Cruce de Calle"
                                name="cruce_id"
                                control={control}
                                 options={
                                    datosIniciales?.combos?.calles?.map((ley: any) =>
                                        ({ value: ley.id, label: ley.nombre }))
                                }
                                error={errors.cruce_id}
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
                                options={[
                                    { value: 1, label: "Comercio" },
                                ]}
                                error={errors.inspector_1_id}
                            />
                            <SelectField
                                label="2° Inspector"
                                name="inspector_2_id"
                                control={control}
                                options={[
                                    { value: 1, label: "Comercio" },
                                ]}
                                error={errors.inspector_2_id}
                            />
                        </div>
                    </div>

                    {/* SECCIÓN: Infractores */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold mb-4">Infractores</h3>
                        <div className="space-y-4">
                            {infractoresFields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <RHFInput
                                            control={control}
                                            name={`Infractores.${index}.tipo`}
                                            label="Tipo"
                                        />
                                        <RHFInput
                                            control={control}
                                            name={`Infractores.${index}.documento`}
                                            label="Documento"
                                        />
                                        <RHFInput
                                            control={control}
                                            name={`Infractores.${index}.identificacion`}
                                            label="Identificación"
                                        />
                                        <RHFInput
                                            control={control}
                                            name={`Infractores.${index}.nombre`}
                                            label="Nombre"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeInfractor(index)}
                                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                    >
                                        Eliminar Infractor
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => appendInfractor({ tipo: '', documento: '', identificacion: '', nombre: '' })}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                + Agregar Infractor
                            </button>
                        </div>
                    </div>

                    {/* SECCIÓN: Padrones */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold mb-4">Padrones</h3>
                        <div className="space-y-4">
                            {patronesFields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <RHFInput
                                            control={control}
                                            name={`Padrones.${index}.tipo`}
                                            label="Tipo"
                                        />
                                        <RHFInput
                                            control={control}
                                            name={`Padrones.${index}.identificacion`}
                                            label="Identificación"
                                        />
                                        <RHFInput
                                            control={control}
                                            name={`Padrones.${index}.nombre`}
                                            label="Nombre"
                                        />
                                        <RHFInput
                                            control={control}
                                            name={`Padrones.${index}.categoria`}
                                            label="Categoría"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removePadron(index)}
                                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                    >
                                        Eliminar Padrón
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => appendPadron({ tipo: '', identificacion: '', nombre: '', categoria: '' })}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                + Agregar Padrón
                            </button>
                        </div>
                    </div>

                    {/* SECCIÓN: Infracciones */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold mb-4">Infracciones</h3>
                        <div className="space-y-4">
                            {infraccionesFields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <RHFInput
                                            control={control}
                                            name={`Infracciones.${index}.tipo`}
                                            label="Tipo"
                                        />
                                        <RHFInput
                                            control={control}
                                            name={`Infracciones.${index}.identificacion`}
                                            label="Identificación"
                                        />
                                        <RHFInput
                                            control={control}
                                            name={`Infracciones.${index}.nombre`}
                                            label="Nombre"
                                        />
                                        <RHFInput
                                            control={control}
                                            name={`Infracciones.${index}.categoria`}
                                            label="Categoría"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeInfraccion(index)}
                                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                    >
                                        Eliminar Infracción
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => appendInfraccion({ tipo: '', identificacion: '', nombre: '', categoria: '' })}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                + Agregar Infracción
                            </button>
                        </div>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex gap-4 mb-6">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
                        >
                            Guardar Cambios
                        </button>
                        <button
                            type="button"
                            onClick={() => reset(acta)}
                            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-semibold"
                        >
                            Descartar Cambios
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center text-gray-500">No se encontró el acta</div>
            )}
        </Container>
    )
}
