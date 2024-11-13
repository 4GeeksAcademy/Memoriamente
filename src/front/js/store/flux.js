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
            size: 1,                 // Tamaño del nivel actual (cantidad de pares de cartas)
            time: 0,                 // Tiempo transcurrido en segundos
            timerInterval: null,     // Intervalo para manejar el temporizador
            timerRunning: false,     // Estado del temporizador (si está corriendo o detenido)

            auth: false
        },

        actions: {
            // Ejemplo de función para cambiar un color
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            // Ejemplo de función para obtener un mensaje del backend
            getMessage: async () => {
                // try {
                //     const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                //     const data = await resp.json();
                //     setStore({ message: data.message });
                //     return data;
                // } catch (error) {
                //    // console.log("Error loading message from backend", error);
                // }
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

            pauseTimer: () => {
                const store = getStore();
                if (store.timerRunning && store.timerInterval) {
                    clearInterval(store.timerInterval);
                    setStore({ timerRunning: false, timerInterval: null });
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

            // Función para reiniciar el juego
            resetGame: () => {
                const store = getStore();

                // Detiene el temporizador si está corriendo
                if (store.timerInterval) {
                    clearInterval(store.timerInterval);
                }

                // Restablece el juego a su estado inicial
                setStore({
                    images: [],
                    score: { current: 0 },
                    clicks: 0,
                    size: 1, // Nivel inicial
                    time: 0,
                    timerInterval: null,
                    timerRunning: false,
                });

                // Recarga las imágenes para el primer nivel
                getActions().fetchImages(1);
            },

            //Carga imágenes y las baraja
            fetchImages: async (size) => {
                const images = [imagen1, imagen2, imagen3, imagen4, imagen5, imagen6, imagen7];
                const selectedImages = images.slice(0, size);
                const shuffledImages = selectedImages
                    .flatMap((item) => [`1|${item}`, `2|${item}`]) // Duplica cada imagen
                    .sort(() => Math.random() - 0.5); // Mezcla las imágenes
                setStore({ images: shuffledImages, size: size, clicks: 0 }); // Reinicia los clics al cargar nuevas imágenes
            },


            // fetchImages: async (size) => {
            //     try {
            //         //const accessKey = "TU_ACCESS_KEY"; // Reemplaza con tu clave de Unsplash
            //         const response = await fetch(`https://rickandmortyapi.com/api/character`);
            //         const data = await response.json();

            //         // Asegúrate de que la URL de las imágenes esté en `data.results`
            //         const images = await data.results.slice(0, 20).map((item) => item.image); // Obtén solo las primeras 20 imágenes

            //         // Duplica y mezcla aleatoriamente las imágenes
            //         const shuffledImages = await images
            //             .flatMap((item) => [`1|${item}`, `2|${item}`]) // Duplica cada imagen con identificadores
            //             .sort(() => Math.random() - 0.5); // Mezcla las imágenes

            //         setStore({ images: shuffledImages, size: size, clicks: 0 });

            //         return data;
            //     } catch (error) {
            //         console.error("Error al cargar las imágenes desde la API:", error);
            //     }
            // },


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
            },


            // DESDE AQUI COMIENZA EL BACKEND

            signup: async (name, lastname, seudonimo, email, password) => {

				const response = await fetch('https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/api/signup', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
                        name: name,
                        lastname: lastname,
                        seudonimo: seudonimo,
						email: email,
						password: password,
						is_active: true
					})
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.msg || 'Error en el signup');
				}

				const data = await response.json();
				console.log('Signup exitoso:', data);
				alert('Registro exitoso!')

			},

            login: async (email, password) => {

				const response = await fetch('https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/api/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: email,
						password: password
					})
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.msg || 'Error en el login');
				}

				const data = await response.json();
				localStorage.setItem("token", data.access_token)
				console.log('Login exitoso:', data);

			},

            autentificar: async () => {
				const token = localStorage.getItem("token");
			
				if (!token) {
					return false; // No token found
				}
			
				try {
					const response = await fetch('https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/api/demo', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						}
					});
			
					if (!response.ok) {
						localStorage.removeItem("token");
						return false; // Invalid token
					}
			
					return true; // Token is valid
				} catch (error) {
					console.error("Error verifying token:", error);
					localStorage.removeItem("token");
					return false; // Error during verification
				}
			},





        }
    };
};

export default getState;
