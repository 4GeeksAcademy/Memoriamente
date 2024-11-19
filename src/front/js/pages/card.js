import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/card.css";
import questions from "../../img/questions-mark.png";

export const Card = () => {

       
    const { store, actions } = useContext(Context);

    // Estado local del componente:
   // const [size, setSize] = useState(1);       
    const [selected, setSelected] = useState([]); 
    const [opened, setOpened] = useState([]);  

    // useEffect que se ejecuta al inicio y cada vez que cambia el tamaño del nivel
    useEffect(() => {
        actions.fetchImages(); // Carga nuevas imágenes según el tamaño de nivel
        actions.resetTimer(); // Reinicia el temporizador al iniciar el nivel
    }, []);

    // Manejador de eventos para el clic en una carta
    const handleClick = (item) => {
        // Solo permite seleccionar si hay menos de 2 cartas seleccionadas y el temporizador está activo
        if (selected.length < 2 && store.timerRunning) {
            setSelected((prevSelected) => [...prevSelected, item]); // Agrega la carta seleccionada
            actions.setClicks(store.clicks + 1); // Incrementa el contador de clics
        }
    };

    // useEffect que revisa si se seleccionaron 2 cartas y si son iguales
    useEffect(() => {
        if (selected.length === 2) {
            // Compara las dos cartas seleccionadas usando el ID de la imagen
            if (selected[0].split('|')[1] === selected[1].split('|')[1]) {
                setOpened((prevOpened) => [...prevOpened, ...selected]); // Agrega las cartas abiertas
            }
            setTimeout(() => setSelected([]), 400); // Reinicia la selección después de un pequeño retraso
        }
    }, [selected]);

    // useEffect que detecta cuando todas las cartas se han abierto
    useEffect(() => {
        if (opened.length === store.images.length) { // Compara cartas abiertas con el total de cartas
            actions.stopTimer(); // Detiene el temporizador
            actions.calculateScore(); // Calcula el puntaje
           // setSize((prevSize) => prevSize + 1); // Incrementa el nivel (aumenta el tamaño del juego)
            setOpened([]); // Resetea las cartas abiertas
            actions.fetchImages(); // Carga nuevas imágenes para el siguiente nivel
            actions.resetTimer(); // Reinicia el temporizador para el nuevo nivel
            //setStore({ level: store.level + 1 }); // Incrementa el nivel
        }
    }, [opened, store.images.length, actions]);

    // Inicia el temporizador cuando el usuario presiona el botón
    const handleStartTimer = () => {
        actions.startTimer();
    };

    // Pausa el temporizador cuando el usuario presiona el botón
    const handlePauseTimer = () => {
        actions.pauseTimer();
    };

    // Reinicia el Juego
    const handleResetGame = () => {
        actions.resetGame(); // Llama a la función para reiniciar el juego
       // setSize(1); // Restablece el nivel localmente
        setSelected([]); // Reinicia las cartas seleccionadas
        setOpened([]); // Reinicia las cartas abiertas
    };

    let include = false;

    

    return (
        <div className="container text-center my-4">
            <h2 className="score mb-4">Score: {store.score.current}</h2> {/* Muestra el puntaje actual */}
            <h2 className="time mb-4">Tiempo: {store.time} segundos</h2> {/* Muestra el tiempo transcurrido */}
            <h2 className="level mb-4">Level: {store.level} </h2> {/* Muestra el nivel actual */}
            

            {/* Botón para iniciar el temporizador si no está corriendo */}
            {!store.timerRunning ? (
                <button onClick={handleStartTimer} className="btn btn-primary mb-3">
                    Iniciar Tiempo
                </button>
            ) : (
                <button onClick={handlePauseTimer} className="btn btn-warning mb-3">
                    Pausar Tiempo
                </button>
            )}

            {/* Botón para reiniciar el juego */}
            <button onClick={handleResetGame} className=" button-rick-morty btn btn-danger mb-3 ms-2">
                Reiniciar Juego
            </button>

            
            <div className="row justify-content-center">
                
                {/* Se trae las imagenes y las vuelve aleatorias */}
                {store.images.map((item, index) => (

                    <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 p-2"> 

                        <div onClick={() => handleClick(item)} className="card-item">

                            <div className="content">

                                {/* Si el par de cartas son iguales la carta se muestra */}
                                {include = selected.includes(item) || opened.includes(item)} 

                                 {/* Imagen de carta oculta */}
                                <div className={`front ${include ? 'flip-front' : ''}`}>
                                    <img src={questions} alt="Question mark" className="img-fluid" />
                                </div>

                                {/* Imagen de carta revelada */}
                                <div className={`back ${include ? 'flip-back' : ''}`}>
                                    <img src={item.split('|')[1]} alt="Card content" className="img-fluid" /> 
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
