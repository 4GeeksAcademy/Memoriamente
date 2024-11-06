import imagen1 from "../../img/1.png";
import imagen2 from "../../img/2.png";
import imagen3 from "../../img/3.png";
import imagen4 from "../../img/4.png";
import imagen5 from "../../img/5.png";
import imagen6 from "../../img/6.png";


const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            images: [], // Almacenará las imágenes generadas
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
            // Función de ejemplo
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            // Obtener mensaje de ejemplo
            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },

            // Cambiar color
            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            },

            // Nueva función para obtener imágenes
            fetchImages: async (size) => {
                // Definir las imágenes
				const images = [
                    imagen1,
                    imagen2,
                    imagen3,
                    imagen4,
                    imagen5,
                    imagen6
                ];


                

                // Obtener solo las primeras `size` imágenes, duplicarlas y mezclarlas aleatoriamente
                const selectedImages = images.slice(0, size);
                const shuffledImages = selectedImages
                    .flatMap((item) => [`1|${item}`, `2|${item}`])
                    .sort(() => Math.random() - 0.5);


					// EJEMPLO PARA CUANDO LLAME A LA API

					// fetchImages: async (size) => {
					// 	try {
					// 		// Imaginemos que tienes una API que devuelve URLs de imágenes
					// 		const response = await fetch("https://api.ejemplo.com/imagenes"); // URL ficticia
					// 		const data = await response.json();
				
					// 		// Supongamos que 'data' contiene un array de URLs de imágenes
					// 		const images = data.slice(0, size);
					// 		const shuffledImages = images
					// 			.flatMap((item) => [item, item]) // Duplica cada imagen
					// 			.sort(() => Math.random() - 0.5); // Mezcla aleatoriamente las imágenes
				

                // Guardar las imágenes en el store
                setStore({ images: shuffledImages });
            }
        }
    };
};

export default getState;

