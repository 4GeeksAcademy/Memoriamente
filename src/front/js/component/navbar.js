import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css"; // Asegúrate de importar este archivo
import rickAndMortyLogo from "../../img/rick-and-morty-logo.png";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-light">
            <div className="container">
                <Link to="/">
                    <img
                        src={rickAndMortyLogo}
                        alt="Rick and Morty Logo"
                        className="brand-logo"
                    />
                </Link>
                <div className="buttons-container">
                    <Link to="/login">
                        <button className="btn btn-success mx-2">Iniciar Sesión</button>
                    </Link>
                    <Link to="/signup">
                        <button className="btn btn-warning mx-2">Registro</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
