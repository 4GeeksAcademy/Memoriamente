import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "../../styles/score.css";

export const Score = () => {
    const [scores, setScores] = useState([]);
    const navigate = useNavigate(); // Hook para redirigir

    useEffect(() => {
        fetchScores();
    }, []);

    const fetchScores = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}api/score`); // <-- Usar el filtro 'last=true'
            if (!response.ok) throw new Error("Error fetching scores");
            const data = await response.json();
            setScores(data); // Actualizar el estado con el último registro (devuelto como objeto)
        } catch (error) {
            console.error(error); 
        }
    };
    

    return (
        <div className="score-container">
            <h1 className="score-title">Tabla de Puntuaciones</h1>
                      
            <table className="score-table">
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Nombre</th>
                        <th>Puntuación</th>
                        <th>Tiempo</th>
                        <th>Nivel</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.length > 0 ? (
                        scores.map((player, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{player.name}</td>
                                <td>{player.score}</td>
                                <td>{player.time}</td>
                                <td>{player.level}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay puntuaciones disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};