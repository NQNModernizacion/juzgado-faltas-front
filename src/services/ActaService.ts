import { toastOptions } from "@/config/toast";
import { axios } from "@/utils/axios";
import { formatoFecha } from "@/utils/date";
import { toast } from "react-toastify";

export const onSubmitAlta = async (formData: any, setIsLoading: any, nav: any) => {

    try {


        formData.padrones = formData.Padrones;
        formData.infractores = formData.Infractores;
        formData.infracciones = Array.isArray(formData.Infracciones)
            ? formData.Infracciones.map((item: any) => item.tipo_id)
            : [];

        formData.fecha_labrada = new Date(formData.fecha_labrada).toISOString().split("T")[0];
        formData.fecha_carga = new Date(formData.fecha_carga).toISOString().split("T")[0];
        formData.fecha_notificado = formData.fecha_notificado ?
            new Date(formData.fecha_notificado).toISOString().split("T")[0] : null;

        // formData.fecha_labrada = '2026-05-19 00:00:00';
        // formData.fecha_labrada = new Date(formData.fecha_labrada).toLocaleDateString();
        // formData.fecha_labrada = new Date(formData.fecha_labrada).toLocaleDateString();

        console.log('formData', formData);
        // return;

        const resp = await axios().post("/registrar_acta", formData);
        const { data, error } = resp.data;


        console.log('data', data);

        if (!data) throw new Error("Error al registrar el acta");

        toast.success("Acta registrada correctamente", toastOptions);

        // nav(`/acta/listado`);

    } catch (error: any) {
        toast.error(error.message, toastOptions);
    }
    finally {
        setIsLoading(false);
    }

}
export const getDatosInicialesActa = async (setIsLoading: any, setDatosIniciales: any) => {
    try {

        setIsLoading(true);
        const resp = await axios().get("/datos_acta");
        const { data, error } = resp.data;

        console.log('data', data);

        // return;

        if (!data) throw new Error("Error al obtener los datos iniciales");

        setDatosIniciales(data);
    } catch (error: any) {
        toast.error(error.message, toastOptions);
    } finally {
        setIsLoading(false);
    }

}

export const getActas = async (setActas: any, setIsLoading: any) => {
    try {

        setIsLoading(true);

        const resp = await axios().get("actas");
        const { data, error } = resp.data;

        console.log('resp', resp);
        console.log('data', data);

        // return;

        if (!data) throw new Error("Error al obtener las actas");

        setActas(data.data);
    } catch (error: any) {
        toast.error(error.message, toastOptions);
    } finally {
        setIsLoading(false);
    }
}

export const getActa = async (id: any, setActa: any, setIsLoading: any) => {
    try {
        setIsLoading(true);

        const resp = await axios().get(`actas/${id}`);
        const { data, error } = resp.data;

        console.log('data', data);

        if (!data) throw new Error("Error al obtener el acta");

        setActa(data);
    } catch (error: any) {
        toast.error(error.message, toastOptions);
    } finally {
        setIsLoading(false);
    }
}