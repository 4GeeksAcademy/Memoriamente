import React, { useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/score.css";

export const Score = () => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch("https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/api/score");
                const data = await response.json();
                setScores(data);
            } catch (error) {
                console.error("Error al obtener la tabla de puntuaciones:", error);
            }
        };

        fetchScores();
    }, []);

    return (
        <div className="score-container">
            <h1 className="score-title">Tabla de Puntuaciones</h1>
            <table className="score-table">
            <thead>
          <tr><th>Nombre</th><th>Puntuación</th><th>Tiempo</th><th>Nivel</th></tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{score.name}</td>
              <td>{score.score}</td>
              <td>{score.time}</td>
              <td>{score.level}</td>
            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
