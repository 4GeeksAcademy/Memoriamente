

const getState = ({ getStore, getActions, setStore }) => {
    return {

        store: {
            message: null,
            images: [],              // Arreglo que contiene las imágenes cargadas en el juego
            score: { current: 0 },   // Puntaje del jugador
            clicks: 0,               // Cantidad de clics realizados
            time: 0,                 // Tiempo transcurrido en segundos
            timerInterval: null,     // Intervalo para manejar el temporizador
            timerRunning: false,     // Estado del temporizador (si está corriendo o detenido)
            level: 1,  // Nivel inicial

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
                            time: updatedStore.time + 1, // Incrementa el tiempo cada segundo
                            
                        });
                    }, 1000);
                    setStore({ timerInterval: interval, timerRunning: true });
                }
            },

            // Función para formatear el tiempo
            formatTime: (timeInSeconds) => {
                const minutes = Math.floor(timeInSeconds / 60); // Obtiene los minutos
                const seconds = timeInSeconds % 60; // Obtiene los segundos restantes
                // Formatea como mm:ss (añade ceros si son menores a 10)
                return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
                    level: 1, // Nivel inicial
                    time: 0,
                    timerInterval: null,
                    timerRunning: false,
                });

                // Recarga las imágenes para el primer nivel
                getActions().fetchImages();
            },

            //Carga imágenes y las baraja
            // fetchImages: async (size) => {
            //     const images = [imagen1, imagen2, imagen3, imagen4, imagen5, imagen6, imagen7];
            //     const selectedImages = images.slice(0, size);
            //     const shuffledImages = selectedImages
            //         .flatMap((item) => [`1|${item}`, `2|${item}`]) // Duplica cada imagen
            //         .sort(() => Math.random() - 0.5); // Mezcla las imágenes
            //     setStore({ images: shuffledImages, size: size, clicks: 0 }); // Reinicia los clics al cargar nuevas imágenes
            // },


            fetchImages: async () => {
                try {
                    const store = getStore();
                    // Asegúrate de que el número de imágenes dependa del nivel correctamente
                    const size = store.level + 4; // Empezamos con 5 imágenes en el primer nivel

                    const response = await fetch(`https://rickandmortyapi.com/api/character`);
                    const data = await response.json();

                    // Seleccionamos el número de imágenes acorde al nivel
                    const images = data.results.slice(0, size).map((item) => item.image);

                    // Duplica y mezcla aleatoriamente las imágenes
                    const shuffledImages = images
                        .flatMap((item) => [`1|${item}`, `2|${item}`]) // Duplica cada imagen
                        .sort(() => Math.random() - 0.5); // Mezcla las imágenes

                    // Actualiza el estado con las nuevas imágenes y reinicia los clics
                    setStore({ images: shuffledImages, clicks: 0 });
                    return data;
                } catch (error) {
                    console.error("Error al cargar las imágenes desde la API:", error);
                }
            },

            levelUp: () => {
                const store = getStore();
                setStore({ level: store.level + 1 });
                getActions().fetchImages(); // Recarga las imágenes para el nuevo nivel
                getActions().resetTimer(); // Reinicia el temporizador para el nuevo nivel
            },


            // Calcula el puntaje en función del nivel y la cantidad de clics
            calculateScore: () => {
                // const store = getStore();
                // const passLevel = store.size * 10;
                // let total = store.score.current;
                // const cards = store.size * 2;


                // if (store.clicks === cards) {
                //     total += (cards * 2) + passLevel;
                // } else if (store.clicks > cards && store.clicks < cards + 5) {
                //     total += cards + passLevel;
                // } else if (store.clicks > cards + 5 && store.clicks < cards + 10) {
                //     total += cards / 2 + passLevel;
                // } else {
                //     total += Math.round(cards / 3) + passLevel;
                // }

                // setStore({ clicks: 0, score: { current: total }, time: 0 }); // Resetea clics y tiempo
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



            // Método para iniciar sesión
            login: async (email, password) => {
                try {
                    // Realiza una solicitud a la API de login
                    const response = await fetch('https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/api/login', {
                        method: 'POST', // Método HTTP para enviar datos
                        headers: {
                            'Content-Type': 'application/json' // Indica que el cuerpo de la solicitud es JSON
                        },
                        body: JSON.stringify({ email, password }) // Convierte el email y password a un formato JSON
                    });

                    // Si la respuesta no es satisfactoria (status !== 2xx)
                    if (!response.ok) {
                        const errorData = await response.json(); // Intenta obtener el mensaje de error del servidor
                        throw new Error(errorData.msg || 'Error en el login'); // Lanza un error con el mensaje recibido o un mensaje genérico
                    }

                    // Si la solicitud fue exitosa, extrae los datos de la respuesta
                    const data = await response.json();

                    // Almacena el token de acceso en el localStorage
                    localStorage.setItem("token", data.access_token);

                    // Cambia el estado global de la aplicación para indicar que el usuario está autenticado
                    setStore({ auth: true });

                    return true; // Devuelve true indicando que el login fue exitoso
                } catch (error) {
                    console.error("Error en login:", error); // Muestra el error en la consola para depuración

                    // Asegura que el estado de autenticación sea false si ocurre algún error
                    setStore({ auth: false });

                    // Lanza el error para que pueda ser manejado fuera de esta función
                    throw error;
                }
            },

            // Método para autenticar al usuario mediante el token
            autentificar: async () => {
                // Obtiene el token almacenado en localStorage
                const token = localStorage.getItem("token");

                // Si no hay un token almacenado, asegura que el usuario no está autenticado y devuelve false
                if (!token) {
                    setStore({ auth: false });
                    return false;
                }

                try {
                    // Realiza una solicitud para validar el token
                    const response = await fetch('https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/api/demo', {
                        method: 'GET', // Método GET para obtener información
                        headers: {
                            'Content-Type': 'application/json', // Indica que la solicitud es JSON
                            'Authorization': `Bearer ${token}` // Añade el token al encabezado para autenticación
                        }
                    });

                    // Si la respuesta no es satisfactoria, asume que el token es inválido
                    if (!response.ok) {
                        localStorage.removeItem("token"); // Elimina el token del almacenamiento
                        setStore({ auth: false }); // Actualiza el estado global a no autenticado
                        return false; // Devuelve false indicando que la autenticación falló
                    }

                    // Si la solicitud fue exitosa, extrae los datos de la respuesta
                    const data = await response.json();

                    // Actualiza el estado global indicando que el usuario está autenticado
                    setStore({ auth: true });
                    return true; // Devuelve true indicando que el usuario está autenticado
                } catch (error) {
                    console.error("Error verificando el token:", error); // Muestra el error en la consola para depuración

                    // Si ocurre un error, elimina el token y asegura que el usuario no está autenticado
                    localStorage.removeItem("token");
                    setStore({ auth: false });

                    return false; // Devuelve false indicando que la autenticación falló
                }
            },

            // Método para cerrar sesión
            logout: () => {
                // Elimina el token almacenado en localStorage
                localStorage.removeItem("token");

                // Actualiza el estado global indicando que el usuario no está autenticado
                setStore({ auth: false });
            },

            //Restablecer Contraseña
            resetPassword: async (password, token) => {
                try {
                    // Realizar solicitud para actualizar la contraseña
                    const response = await fetch("https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/reset-password", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}` // Añade el token para autenticación
                        },
                        body: JSON.stringify({ password }) // Envía la nueva contraseña
                    });

                    const data = await response.json();

                    if (response.ok) {
                        return { success: true, msg: data.msg }; // Contraseña actualizada exitosamente
                    } else {
                        return { success: false, msg: data.msg || "Error al actualizar contraseña" }; // Error en la solicitud
                    }
                } catch (error) {
                    console.error("Error en resetPassword:", error);
                    return { success: false, msg: "Hubo un problema con el servidor" };
                }
            },

            // Olvide contraseña

            recoverPassword: async (email) => {
                try {
                    const response = await fetch(
                        "https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/forgot-password",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ email }),
                        }
                    );

                    if (response.ok) {
                        return { success: true, msg: `Correo enviado a ${email} para recuperar la contraseña.` };
                    } else {
                        const data = await response.json();
                        return { success: false, msg: `Error: ${data.msg}` };
                    }
                } catch (error) {
                    console.error("Error al enviar el correo de recuperación:", error);
                    return { success: false, msg: "Hubo un error al enviar el correo." };
                }
            },










        }
    };
};

export default getState;
