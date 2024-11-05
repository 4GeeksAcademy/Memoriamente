import { getImages } from "../pages/getImages"; // Asegúrate de ajustar la ruta según corresponda

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            images: [], // Añade una propiedad para almacenar las imágenes en el store
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "THIRD",
                    background: "white",
                    initial: "white"
                }
            ],
        },
        actions: {
            // Utilice getActions para llamar a una función dentro de una función
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getMessage: async () => {
                try {
                    // obteniendo datos del backend
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },

            changeColor: (index, color) => {
                // Obtén el store
                const store = getStore();

                // Actualiza el array de demo para cambiar el color de fondo en el índice correspondiente
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });

                // Actualiza el store global
                setStore({ demo: demo });
            },

            // Nueva acción para obtener imágenes
            fetchImages: (size) => {
                const images = getImages(size); // Llama a la función getImages con el tamaño deseado
                setStore({ images: images }); // Guarda las imágenes en el store
            }
        }
    };
};

export default getState;
