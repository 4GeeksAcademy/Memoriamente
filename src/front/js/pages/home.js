import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import rickAndMortyLogo from "../../img/rick-and-morty-logo.png"; // Importa el logo correctamente

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<>
			{/* Barra de navegación */}
			<div className="container d-flex align-items-center justify-content-between">
				{/* Logo como enlace */}
				<Link to="/">
					<img 
						src={rickAndMortyLogo} 
						alt="Rick and Morty Logo" 
						className="brand-logo" 
						style={{ height: "200px" }} // Estilo para ajustar el tamaño del logo
					/>
				</Link>
				
				{/* Botones de navegación */}
				<div>
					<Link to="/login">
						<button className="btn btn-primary mx-2">Iniciar Sesión</button>
					</Link>
					<Link to="/signup">
						<button className="btn btn-primary mx-2">Registro</button>
					</Link>
				</div>
			</div>

			{/* Contenido principal */}
			<div className="card-container text-center mt-5">
				<h1>MEMORIAMENTE</h1>
			</div>
		</>
	);
};
