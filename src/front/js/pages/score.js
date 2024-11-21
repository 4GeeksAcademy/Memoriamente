import React, { useEffect, useState } from "react";
import "../../styles/score.css";

export const Score = () => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        fetchScores();
    }, []);

    const fetchScores = async () => {
        try {
            const response = await fetch("https://your-api-url/api/scores");
            if (!response.ok) throw new Error("Error fetching scores");
            const data = await response.json();
            setScores(data); // Actualiza el estado con los datos de la API
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
                    {scores.map((player, index) => (
                        <tr key={index}>
                            <td>{player.position}</td>
                            <td>{player.name}</td>
                            <td>{player.score}</td>
                            <td>{player.time}</td>
                            <td>{player.level}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
