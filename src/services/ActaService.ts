import { toastOptions } from "@/config/toast";
import { axios } from "@/utils/axios";
import { toast } from "react-toastify";

export const onSubmitAlta = async (formData: any, setIsLoading: any, nav: any) => {

    try {

        console.log('formData', formData);

        formData.padrones = formData.Padrones;
        formData.infractores = formData.Infractores;
        formData.infracciones = [1];
        // formData.infracciones = formData.Infracciones;

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

        if (!data) throw new Error("Error al obtener las actas");

        setActas(data);
    } catch (error: any) {
        toast.error(error.message, toastOptions);
    } finally {
        setIsLoading(false);
    }
}