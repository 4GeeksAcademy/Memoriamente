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
            images: [],              // Arreglo que contiene las imágenes cargadas en el juego
            score: { current: 0 },   // Puntaje del jugador
            clicks: 0,               // Cantidad de clics realizados
            size: 3,                 // Tamaño del nivel actual (cantidad de pares de cartas)
            time: 0,                 // Tiempo transcurrido en segundos
            timerInterval: null,     // Intervalo para manejar el temporizador
            timerRunning: false,     // Estado del temporizador (si está corriendo o detenido)
        },

        actions: {
            // Ejemplo de función para cambiar un color
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            // Ejemplo de función para obtener un mensaje del backend
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

            // Inicia el temporizador
            startTimer: () => {
                const store = getStore();
                if (!store.timerRunning) { // Solo inicia si no está corriendo
                    const interval = setInterval(() => {
                        const updatedStore = getStore();
                        setStore({ 
                            ...updatedStore, 
                            time: updatedStore.time + 1 // Incrementa el tiempo cada segundo
                        });
                    }, 1000);
                    setStore({ timerInterval: interval, timerRunning: true });
                }
            },

            // Detiene el temporizador
            stopTimer: () => {
                const store = getStore();
                if (store.timerInterval) {
                    clearInterval(store.timerInterval);
                    setStore({ timerInterval: null, timerRunning: false });
                }
            },

            // Reinicia el temporizador 
            resetTimer: () => {
                const store = getStore();
                if (store.timerInterval) {
                    clearInterval(store.timerInterval);
                }
                setStore({ time: 0, timerInterval: null, timerRunning: false });
            },

            // Carga imágenes y las baraja
            fetchImages: async (size) => {
                const images = [imagen1, imagen2, imagen3, imagen4, imagen5, imagen6, imagen7];
                const selectedImages = images.slice(0, size);
                const shuffledImages = selectedImages
                    .flatMap((item) => [`1|${item}`, `2|${item}`]) // Duplica cada imagen
                    .sort(() => Math.random() - 0.5); // Mezcla las imágenes
                setStore({ images: shuffledImages, size: size, clicks: 0 }); // Reinicia los clics al cargar nuevas imágenes
            },


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


            // Calcula el puntaje en función del nivel y la cantidad de clics
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
                
                setStore({ clicks: 0, score: { current: total }, time: 0 }); // Resetea clics y tiempo
            },

            // Actualiza la cantidad de clics
            setClicks: (newClicks) => {
                setStore({ clicks: newClicks });
            }
        }
    };
};

export default getState;
