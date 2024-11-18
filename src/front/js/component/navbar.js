import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css"; // Asegúrate de importar este archivo

export const Navbar = () => {
    return (
        <nav className="navbar navbar-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">Rick & Morty</span>
                </Link>
                <div className="ml-auto">
                    <Link to="/login">
                        <button className="btn btn-primary">Iniciar Sesión</button>
                    </Link>
                    <Link to="/signup">
                        <button className="btn btn-primary">Registro</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
