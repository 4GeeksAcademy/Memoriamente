import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/navbar.css"; // Archivo de estilos del Navbar
import rickAndMortyLogo from "../../img/rick-and-morty-logo.png";

export const Navbar = () => {
    const location = useLocation(); // Obtiene la ruta actual

    // Detectar si estás en la vista del juego
    const isGameView = location.pathname === "/demo"; // Cambia "/game" por la ruta de tu vista de juego

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

                {!isGameView ? (
                    // Navbar estándar para otras vistas
                    <div className="buttons-container">
                        <Link to="/login">
                            <button className="btn btn-success mx-2">Iniciar Sesión</button>
                        </Link>
                        <Link to="/signup">
                            <button className="btn btn-warning mx-2">Registro</button>
                        </Link>
                    </div>
                ) : (
                    // Navbar personalizado para la vista del juego
                    <div className="game-navbar">
                        <p className="welcome-message">¡Bienvenid@ a la partida!</p>
                        <Link to="/">
                            <button className="btn btn-danger mx-2">Cerrar Sesión</button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
