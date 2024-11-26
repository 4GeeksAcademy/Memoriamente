import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/navbar.css"; // Archivo de estilos del Navbar
import rickAndMortyLogo from "../../img/rick-and-morty-logo.png";

export const Navbar = () => {
    const location = useLocation(); // Obtiene la ruta actual
    const [userName, setUserName] = useState("");


    useEffect(() => {
        const storedUserName = localStorage.getItem("user_name"); // Recupera el nombre del usuario desde el localStorage
        if (storedUserName) {
            setUserName(storedUserName); // Si se encuentra, actualiza el estado
        }
    }, [location]); // Este efecto se ejecuta cuando la ruta cambia

    // Comprobar si estamos en la vista de puntuaciones (score) o en el inicio del juego (demo)
    const isScoreView = location.pathname === "/score";
    const isGameView = location.pathname === "/demo";

    return (
        <nav className={`navbar navbar-light ${isGameView ? "navbar-game" : ""}`}>
            <div className="container">
                <Link to="/">
                    <img
                        src={rickAndMortyLogo}
                        alt="Rick and Morty Logo"
                        className="brand-logo"
                    />
                </Link>

                {isScoreView ? (
                    // Navbar personalizado para la vista de puntuaciones
                    <div className="score-navbar">
                        <p>¡Bienvenido {userName}!</p>
                        <button
                            onClick={() => window.location.href = '/demo'} // Redirige a /demo (inicio del juego)
                            className="btn btn-primary mx-2"
                        >
                            Ir al Inicio del Juego
                        </button>
                    </div>
                ) : isGameView ? (
                    // Navbar personalizado para la vista del juego
                    <div className="game-navbar">
                        <p className="welcome-message">¡Bienvenid@ a la partida! {userName || "ANÓNIMO"}!</p>
                        <Link to="/" onClick={() => actions.logout()}>
                            <button className="btn btn-danger mx-2">Cerrar Sesión</button>
                        </Link>
                    </div>
                ) : (
                    // Navbar estándar para otras vistas
                    <div className="buttons-container">
                        <Link to="/login">
                            <button className="btn btn-success mx-2">Iniciar Sesión</button>
                        </Link>
                        <Link to="/signup">
                            <button className="btn btn-warning mx-2">Registro</button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
