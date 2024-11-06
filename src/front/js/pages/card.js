import React, { useEffect, useContext, useState } from "react"; 
import { Context } from "../store/appContext";
import "../../styles/card.css";
import questions from "../../img/questions-mark.png";

export const Card = () => {
    const { store, actions } = useContext(Context);

    // Estado local para manejar el tamaño de las cartas (incrementa cada nivel)
    const [size, setSize] = useState(3); // Empieza con 3 pares
    const [selected, setSelected] = useState([]); // Para seleccionar las imágenes
    const [opened, setOpened] = useState([]); // Para registrar las imágenes acertadas

    // Cargar imágenes al montar el componente
    useEffect(() => {
        actions.fetchImages(size); // Llama a fetchImages con el tamaño inicial
    }, [size]); // Volver a cargar cuando el tamaño cambie

    const handleClick = (item) => {
        if (selected.length < 2) {
            setSelected(prevSelected => [...prevSelected, item]);
        }
    };

    // Comparar cartas seleccionadas
    useEffect(() => {
        if (selected.length === 2) {
            if (selected[0].split('|')[1] === selected[1].split('|')[1]) {
                setOpened(prevOpened => [...prevOpened, ...selected]);
            }
            setTimeout(() => setSelected([]), 500); // Resetea las cartas seleccionadas
        }
    }, [selected]);

    // Incrementar dificultad cuando se aciertan todas las cartas
    useEffect(() => {
        if (opened.length === store.images.length) {
            setSize(prevSize => prevSize + 1); // Aumenta el tamaño (dificultad)
            setOpened([]); // Resetea las cartas abiertas para el nuevo nivel
            actions.fetchImages(size + 1); // Carga las imágenes del nuevo tamaño
        }
    }, [opened, store.images.length, actions, size]);

    let include = false;

    return (
        <>
            <h2>Score: 100</h2>
            <div className="card">
                <ul>
                    {store.images.map((item, index) => (
                        <li key={index} onClick={() => handleClick(item)}>
                            <div className="content">
                                {include = selected.includes(item) || opened.includes(item) }

                                {/* Efecto de dar vuelta a la carta */}
                                <div className={`front ${include ? 'flip-front' : ''}`}>
                                    <img src={questions} alt="" />
                                </div>
                                <div className={`back ${include ? 'flip-back' : ''}`}>
                                    <img src={item.split('|')[1]} alt="" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
