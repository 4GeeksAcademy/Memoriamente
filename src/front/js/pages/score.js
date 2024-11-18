import React from "react";
import "../../styles/score.css"; // Asegúrate de crear este archivo de estilos

export const Score = () => {
    // Datos de ejemplo para la tabla
    const scores = [
        { name: "Rick", score: 100, time: "2:30", level: "4" },
        { name: "Morty", score: 80, time: "3:10", level: "3" },
        { name: "Summer", score: 60, time: "5:15", level: "2" },
        { name: "Jerry", score: 20, time: "10:00", level: "1" },
    ];

    return (
        <div className="score-container">
            <h1 className="score-title">Tabla de Puntuaciones</h1>
            <table className="score-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Puntuación</th>
                        <th>Tiempo</th>
                        <th>Nivel</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((player, index) => (
                        <tr key={index}>
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
