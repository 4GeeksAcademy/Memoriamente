import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/card.css";
import questions from "../../img/questions-mark.png";
import { useNavigate } from "react-router-dom";


export const Card = () => {
    const { store, actions } = useContext(Context);

    // Estado local del componente
    const [selected, setSelected] = useState([]);
    const [opened, setOpened] = useState([]);
    const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal

    const navigate = useNavigate();

    const handleNavigateToScores = () => {
        navigate("/score");
    };

    // useEffect que se ejecuta al inicio
    useEffect(() => {
        actions.fetchImages(); // Carga nuevas imágenes según el nivel
        actions.pauseTimer(); // Reinicia el temporizador al iniciar el nivel
    }, [store.level]);

    // Manejador de eventos para el clic en una carta
    const handleClick = (item) => {
        if (selected.length < 2 && store.timerRunning) {
            setSelected((prevSelected) => [...prevSelected, item]);
            actions.setClicks(store.clicks + 1);
        }
    };

    // useEffect que revisa si se seleccionaron 2 cartas y si son iguales
    useEffect(() => {
        if (selected.length === 2) {
            if (selected[0].split("|")[1] === selected[1].split("|")[1]) {
                setOpened((prevOpened) => [...prevOpened, ...selected]);
            }
            setTimeout(() => setSelected([]), 400);
        }
    }, [selected]);

    // useEffect que detecta cuando todas las cartas se han abierto
    useEffect(() => {
        if (opened.length === store.images.length && store.images.length > 0) {
            actions.pauseTimer(); // Pausa el temporizador al completar el nivel
            actions.calculateScore();
            setShowModal(true);   // Mostrar modal después de ganar

            // Crear los datos para enviar al servidor TABLA DE PUNTUACION
            const playerData = {
                user_id: store.user_id || null, // Si el jugador está autenticado
                name: store.user_name || "Anónimo",
                score: store.score.current,
                time: formatTime(store.time), // Formatear tiempo a "mm:ss"
                level: store.level,
            };

            // Llamar a la función para guardar los datos en el servidor
            actions.saveScore(playerData);

            // Mostrar modal después de ganar
            setShowModal(true);
        }
    }, [opened, store.images.length]);




    useEffect(() => {
        // Asegúrate de que el nivel esté en 1 al cargar
        if (store.level !== 1) {
            actions.resetGame(); // Reinicia el juego si no está en el nivel inicial
        }
    }, []);

    // Función para pasar al siguiente nivel desde el modal
    const handleNextLevel = () => {
        setShowModal(false); // Cierra el modal
        actions.levelUp(); // Incrementa el nivel
        setOpened([]); // Reinicia las cartas abiertas
        actions.fetchImages(); // Carga nuevas imágenes
        actions.pauseTimer(); // Pausa el temporizador al iniciar el nuevo nivel
    };

    // Reinicia el Juego
    const handleResetGame = () => {
        actions.resetGame(); // Llama a la función para reiniciar el juego
        setSelected([]);
        setOpened([]);
        setShowModal(false); // Cierra el modal si estaba abierto
    };

    // Formatea el tiempo como mm:ss
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    let include = false;

    return (
        <div className="container text-center my-4">
            <h2 className="score mb-4">Score: {store.score.current}</h2>
            <h2 className="time mb-4">Tiempo: {formatTime(store.time)} </h2>
            <h2 className="level mb-4">Level: {store.level} </h2>

            {!store.timerRunning ? (
                <button onClick={() => actions.startTimer()} className="btn btn-primary mb-3">
                    {store.time === 0 ? "Iniciar Tiempo" : "Continuar Tiempo"}
                </button>
            ) : (
                <button onClick={() => actions.pauseTimer()} className="btn btn-warning mb-3">
                    Pausar Tiempo
                </button>
            )}

            <button onClick={handleResetGame} className="button-rick-morty btn btn-danger mb-3 ms-2">
                Reiniciar Juego
            </button>

            <div className="row justify-content-center">
                {store.images.map((item, index) => (
                    <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 p-2">
                        <div onClick={() => handleClick(item)} className="card-item">
                            <div className="content">
                                {include = selected.includes(item) || opened.includes(item)}
                                <div className={`front ${include ? "flip-front" : ""}`}>
                                    <img src={questions} alt="Question mark" className="img-fluid" />
                                </div>
                                <div className={`back ${include ? "flip-back" : ""}`}>
                                    <img src={item.split("|")[1]} alt="Card content" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
               onClick={handleNavigateToScores}
                className="btn btn-info mb-3 ms-2"
            >
                Tabla de Puntuaciones
            </button>


            {/* Modal para mostrar el mensaje de victoria */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content rick-and-morty">
                        <h2>¡Wubba Lubba Dub-Dub! 🎉</h2>
                        <p>
                            ¡Felicidades, humano! Morty, escucha esto... ¡PASASTE DE NIVEL! No la arruines en el próximo, ¿ok?
                        </p>
                        <button onClick={handleNextLevel} className="btn btn-success">
                            ¡Siguiente Nivel, vamos ya!
                        </button>
                        <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                            Meh... Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
