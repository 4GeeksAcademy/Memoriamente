import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/card.css";
import questions from "../../img/questions-mark.png";

export const Card = () => {
    const { store, actions } = useContext(Context);
    const [size, setSize] = useState(3); 
    const [selected, setSelected] = useState([]); 
    const [opened, setOpened] = useState([]); 

    // Inicializar el nivel y cargar imágenes
    useEffect(() => {
        actions.fetchImages(size); 
        actions.resetTimer(); // Reinicia el tiempo al inicio del nivel
    }, [size]);

    // Función que maneja el clic en una carta
    const handleClick = (item) => {
        if (selected.length < 2 && store.timerRunning) { 
            setSelected((prevSelected) => [...prevSelected, item]);
            actions.setClicks(store.clicks + 1); 
        }
    };

    // Evaluar si las cartas seleccionadas son iguales
    useEffect(() => {
        if (selected.length === 2) { 
            if (selected[0].split('|')[1] === selected[1].split('|')[1]) {
                setOpened((prevOpened) => [...prevOpened, ...selected]);
            }
            setTimeout(() => setSelected([]), 400);
        }
    }, [selected]);

    // Incrementar el nivel al abrir todas las cartas, Parar el tiempo, calcular el Score
    useEffect(() => {
        if (opened.length === store.images.length) {
            actions.stopTimer(); // Detiene el temporizador al completar el nivel
            actions.calculateScore();
            setSize((prevSize) => prevSize + 1); 
            setOpened([]);
            actions.fetchImages(size + 1); 
            actions.resetTimer(); 
        }
    }, [opened, store.images.length, actions, size]);

    // Botón de inicio de tiempo
    const handleStartTimer = () => {
        actions.startTimer();
    };

   

    let include = false;

    return (
        <div className="container text-center my-4">
            <h2 className="score mb-4">Score: {store.score.current}</h2> 
            <h2 className="time mb-4">Tiempo: {store.time} segundos</h2>

             {/* Botón para iniciar el temporizador */}
             {!store.timerRunning && (
                <button onClick={handleStartTimer} className="btn btn-primary mb-3">
                    Iniciar Tiempo
                </button>
            )}

            {/* Contenedor de cartas */}
            <div className="row justify-content-center">
                {store.images.map((item, index) => (
                    <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 p-2"> 
                        <div onClick={() => handleClick(item)} className="card-item">
                            <div className="content">
                                {include = selected.includes(item) || opened.includes(item)}
                                <div className={`front ${include ? 'flip-front' : ''}`}>
                                    <img src={questions} alt="Question mark" className="img-fluid" />
                                </div>
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
