import { getToken } from "./authService"; // NUEVO

const API_URL = "http://localhost:3000/api/analisar";


export const analizarTexto = async (texto) => {

    try {

        // Validar que exista texto
        if (!texto || texto.trim() === "") {

            throw {
                codigo: "EMPTY_TEXT",
                mensaje: "No se ingresó ningún texto para analizar."
            };

        }


        // Enviar texto al backend
        const respuesta = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}` // NUEVO
            },

            body: JSON.stringify({
                texto: texto
            })

        });



        // Verificar si la API respondió con error
        if (!respuesta.ok) {

            throw {
                codigo: "API_ERROR",
                mensaje: "Ocurrió un error al comunicarse con el servicio de inteligencia artificial."
            };

        }



        // Obtener respuesta del backend
        const datos = await respuesta.json();



        // Devolver objeto estructurado
        return {

            veredicto: datos.veredicto,

            explicacion: datos.explicacion

        };


    } catch (error) {


        // Error de red o error controlado
        throw {

            codigo: error.codigo || "NETWORK_ERROR",

            mensaje: error.mensaje || 
            "No fue posible conectarse con la inteligencia artificial."

        };


    }

};