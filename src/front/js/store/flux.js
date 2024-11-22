

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

                        //console.log("Tiempo incrementado:", updatedStore.time); // DEBUG

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

             // Pausa el temporizador

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

           //Trae las Imagenes de la Api y carga las cartas  

            fetchImages: async () => {
                try {
                    const store = getStore();

                   // console.log("Tiempo actual antes de fetchImages:", store.time); // DEBUG

                   
                    const response = await fetch(`https://rickandmortyapi.com/api/character`);
                    const data = await response.json();

                    // Seleccionamos el número de imágenes acorde al nivel
                    const images = data.results.slice(0, store.level).map((item) => item.image);

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

            // Sube de nivel
            levelUp: () => {
                const store = getStore();

               // console.log("Tiempo actual antes de levelUp:", store.time); // DEBUG    

                setStore({ level: store.level + 1 });
                             
            },


            // Calcula el puntaje en función del nivel y la cantidad de clics
            calculateScore: () => {
                const store = getStore();
                
                // Calcula el puntaje base para el nivel actual
                const passLevelBonus = store.level * 10; 
                const totalCards = store.images.length; // Total de cartas (ya duplicadas)
                const uniqueCards = totalCards / 2; // Cartas únicas (sin duplicar)
            
                let totalScore = store.score.current;
            
                // Calcula el puntaje según la cantidad de clics realizados
                if (store.clicks === totalCards) {
                    // Caso perfecto: todos los pares en el mínimo de clics
                    totalScore += (uniqueCards * 2) + passLevelBonus;
                } else if (store.clicks > totalCards && store.clicks <= totalCards + 5) {
                    // Caso bueno: algunos clics adicionales
                    totalScore += uniqueCards + passLevelBonus;
                } else if (store.clicks > totalCards + 5 && store.clicks <= totalCards + 10) {
                    // Caso regular: varios clics adicionales
                    totalScore += Math.floor(uniqueCards / 2) + passLevelBonus;
                } else {
                    // Caso malo: demasiados clics
                    totalScore += Math.floor(uniqueCards / 3) + passLevelBonus;
                }
            
                // Actualiza el `store` con el nuevo puntaje, reinicia clics y tiempo
                setStore({
                    score: { current: totalScore },
                    clicks: 0
                    
                });
            
                
            },
            

            // Actualiza la cantidad de clics
            setClicks: (newClicks) => {
                setStore({ clicks: newClicks });
            },


            // DESDE AQUI COMIENZA EL BACKEND

            signup: async (name, lastname, email, password) => {

                const response = await fetch('https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        lastname: lastname,
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
                    const response = await fetch('https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.msg || 'Error en el login');
                    }
            
                    const data = await response.json();
            
                    // Guarda el token de acceso
                    localStorage.setItem("token", data.access_token);
            
                    // Reinicia el juego al estado inicial (nivel 1, puntuación 0, etc.)
                    setStore({
                        auth: true,
                        images: [], // Reinicia las cartas
                        score: { current: 0 }, // Reinicia puntuación
                        clicks: 0, // Reinicia clics
                        level: 1, // Nivel inicial
                        time: 0, // Tiempo inicial
                        timerInterval: null,
                        timerRunning: false,
                    });
            
                    return true; // Login exitoso
                } catch (error) {
                    console.error("Error en login:", error);
                    setStore({ auth: false });
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
            
                // Reinicia el estado global al estado inicial
                setStore({
                    auth: false, // Usuario no autenticado
                    images: [], // Reiniciar las cartas
                    score: { current: 0 }, // Reiniciar puntuación
                    clicks: 0, // Reiniciar clics
                    level: 1, // Regresar al nivel inicial
                    time: 0, // Reiniciar el temporizador
                    timerInterval: null,
                    timerRunning: false,
                });
            
                // Opcional: Muestra un mensaje de cierre de sesión exitoso
                console.log("Sesión cerrada. Progreso reiniciado.");
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
