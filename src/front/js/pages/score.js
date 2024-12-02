import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "../../styles/score.css";


export const Score = () => {
    const [scores, setScores] = useState([]); // Estado para guardar las puntuaciones
    const navigate = useNavigate(); // Hook para redirigir

    // Ejecutar al montar el componente
    useEffect(() => {
        fetchScores(); // Llamar a la función para obtener puntuaciones
    }, []);

    const fetchScores = async () => {
        try {
            // Llamada al backend para obtener todas las puntuaciones
            const response = await fetch(`${process.env.BACKEND_URL}api/score`);
            if (!response.ok) throw new Error("Error al obtener las puntuaciones");
 
            const data = await response.json();
            setScores(data); // Actualizar el estado con las puntuaciones recibidas
        } catch (error) {
            console.error("Error al obtener las puntuaciones:", error);
        }
    };

    return (
        <div className="score-container">
            <h1 className="score-title">🏆Tabla de Puntuaciones🏆</h1>

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
                        scores.map((player) => (
                            <tr key={player.id}>
                                <td>{player.position}</td>
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
