// Card.js
import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/card.css";

export const Card = () => {
    const { store, actions } = useContext(Context);

    // Llama a fetchImages cuando el componente se monta, con el tamaño de 3
    useEffect(() => {
        actions.fetchImages(3); // Cambia el número según el tamaño deseado
    }, []); // Solo se ejecuta una vez cuando el componente se monta

    return (
        <>
            <h2>Score: 100</h2>
            <div className="card">
                <ul>
                    {store.images.map((item, index) => (
                        <li key={index}>
                            <div className="content">
                                <div className="front">
                                    <img src={item} alt="" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
