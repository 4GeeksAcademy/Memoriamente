import imagen1 from "../../img/1.png";
import imagen2 from "../../img/2.png";
import imagen3 from "../../img/3.png";
import imagen4 from "../../img/4.png";
import imagen5 from "../../img/5.png";
import imagen6 from "../../img/6.png";
import imagen7 from "../../img/7.png";

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            images: [], // Almacenará las imágenes generadas
            score: { current: 0 }, // Puntaje actual
            clicks: 0,              // Contador de clics realizados
            size: 3,                // Nivel inicial
            demo: [
                { title: "FIRST", background: "white", initial: "white" },
                { title: "SECOND", background: "white", initial: "white" },
                { title: "THIRD", background: "white", initial: "white" }
            ],
        },
        actions: {
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
                   // console.log("Error loading message from backend", error);
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
                const images = [imagen1, imagen2, imagen3, imagen4, imagen5, imagen6, imagen7];
                const selectedImages = images.slice(0, size);
                const shuffledImages = selectedImages
                    .flatMap((item) => [`1|${item}`, `2|${item}`])
                    .sort(() => Math.random() - 0.5);
                
                setStore({ images: shuffledImages, size: size, clicks: 0 }); // Reinicia `clicks` al cargar nuevas imágenes
            },

            // Función para calcular el puntaje
            calculateScore: () => {
                const store = getStore();
                const passLevel = store.size * 10;
                let total = store.score.current;
                const cards = store.size * 2;
                
                if (store.clicks === cards) {
                    total += (cards * 2) + passLevel;
                } else if (store.clicks > cards && store.clicks < cards + 5) {
                    total += cards + passLevel;
                } else if (store.clicks > cards + 5 && store.clicks < cards + 10) {
                    total += cards / 2 + passLevel;
                } else {
                    total += Math.round(cards / 3) + passLevel;
                }
                
                setStore({ clicks: 0, score: { current: total } });
            },

            // Función para actualizar la cantidad de clics
            setClicks: (newClicks) => {
                setStore({ clicks: newClicks });
            }
        }
    };
};

export default getState;
