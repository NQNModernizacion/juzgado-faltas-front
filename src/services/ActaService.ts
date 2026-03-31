import { toastOptions } from "@/config/toast";
import { toast } from "react-toastify";

export const onSubmitAlta = async (formData: any, setIsLoading: any, nav: any) => {

    try {

        console.log('formData', formData);

        // setActa(formData);

        // nav('/titular/documentacion');


        return;



        // setIsLoading(true);
        // formData.fecha_acarreo = formData.fecha_acarreo.toISOString().split("T")[0];



        const data = await postForm("acarreo", formData, setIsLoading)

        if (!data) throw new Error("Error al registrar el acarreo");

        if (!data.acarreo) throw new Error("Error al registrar el acarreo");

        // setAcarreo(data.acarreo);
        // setShowModal(true);

        if (!data.recibo) throw new Error("Error al generar el recibo");

        toast.success("Acarreo registrado correctamente", toastOptions);
        // setRecibo(data.recibo);

    } catch (error: any) {
        toast.error(error.message, toastOptions);
    }
    finally {
        setIsLoading(false);
    }

}