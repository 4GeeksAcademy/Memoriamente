import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/card.css";
import questions from "../../img/questions-mark.png";

export const Card = () => {
   
    const { store, actions } = useContext(Context);
    
    // Estado cantidad de cartas en el tablero
    const [size, setSize] = useState(3); 

    // Estado para seleccionar las cartas
    const [selected, setSelected] = useState([]); 
    
    // Estado para las cartas ya acertadas y abiertas
    const [opened, setOpened] = useState([]); 

    // useEffect para inicializar el nivel del juego
    useEffect(() => {
        actions.fetchImages(size); // Llama a una acción en el contexto para cargar las imágenes
    }, [size]); // Ejecuta este efecto cuando cambia `size`

    // Función que maneja el clic en una carta
    const handleClick = (item) => {
        if (selected.length < 2) { 
            setSelected((prevSelected) => [...prevSelected, item]); // Agrega la carta clicada al estado `selected`
        }
    };

    // useEffect para evaluar si las cartas seleccionadas son iguales
    useEffect(() => {
        if (selected.length === 2) { 
            // Verifica si las dos cartas tienen el mismo identificador después del "|"
            if (selected[0].split('|')[1] === selected[1].split('|')[1]) {
                setOpened((prevOpened) => [...prevOpened, ...selected]); // Añade las cartas a `opened` si son iguales se mantienen abiertas
            }
            // Restablece el estado `selected` después de un breve retraso para mostrar ambas cartas
            setTimeout(() => setSelected([]), 400);
        }
    }, [selected]); 

    // useEffect para aumentar el nivel si todas las cartas han sido acertadas
    useEffect(() => {
        if (opened.length === store.images.length) { // Comprueba si todas las cartas están abiertas
            setSize((prevSize) => prevSize + 1); // Incrementa el tamaño del juego
            setOpened([]); // Reinicia las cartas abiertas
            actions.fetchImages(size + 1); // Llama a `fetchImages` para recargar imágenes con el nuevo tamaño
        }
    }, [opened, store.images.length, actions, size]); // Activa este efecto cuando `opened` cambia

    // Variable de control para verificar si la carta debe mostrarse volteada
    let include = false;

    return (
        <div className="container text-center my-4">
            <h2 className="score mb-4">Score: 100</h2> 
            
            {/* Contenedor de cartas */}

            <div className="row justify-content-center">
                {store.images.map((item, index) => (
                    <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 p-2"> 
                        <div onClick={() => handleClick(item)} className="card-item">
                            <div className="content">

                                {/* Verifica si la carta está seleccionada o abierta */}
                                {include = selected.includes(item) || opened.includes(item)}

                                {/* Efecto de volteo de la carta */}
                                <div className={`front ${include ? 'flip-front' : ''}`}>
                                   
                                    {/* Imagen de la parte frontal (marca de pregunta) */}
                                    <img src={questions} alt="Question mark" className="img-fluid" />
                                </div>
                                
                                <div className={`back ${include ? 'flip-back' : ''}`}>
                                   
                                    {/* Imagen de la parte posterior, que muestra el contenido de la carta */}
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
