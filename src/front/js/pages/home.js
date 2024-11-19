import React, { useState } from "react";
import { Link } from "react-router-dom";
import rickAndMortyLogo from "../../img/rick-and-morty-logo.png";
import "../../styles/home.css";
import imagen29 from "../../img/29.png"

export const Home = () => {
	// Estado para controlar el índice del diálogo
	const [currentLine, setCurrentLine] = useState(0);

	// Diálogo dividido en líneas con personaje y texto
	const dialogue = [
		{ character: "Rick", text: "¡Morty! Escucha, Morty... jugar memoria no es solo para perder el tiempo, ¿entiendes?" },
		{ character: "Rick", text: "Es como un entrenamiento cerebral, Morty. ¡Fortaleces tus conexiones neuronales!" },
		{ character: "Morty", text: "¿En serio, Rick? ¿No es solo para niños y personas aburridas?" },
		{ character: "Rick", text: "Cada vez que encuentras una pareja de cartas, mejoras tu memoria y atención." },
		{ character: "Rick", text: "¡Es el primer paso para conquistar la multirrealidad, Morty!" },
		{ character: "Morty", text: "Wow, Rick... nunca pensé que fuera tan épico." },
		{ character: "Rick", text: "¡Exacto, Morty! Ahora encuentra esas malditas coincidencias." },
	];

	// Función para mostrar la siguiente línea
	const nextLine = () => {
		if (currentLine < dialogue.length - 1) {
			setCurrentLine(currentLine + 1);
		}
	};

	// Función para reiniciar el diálogo (opcional)
	const resetDialogue = () => {
		setCurrentLine(0);
	};

	return (

		<div className="auth-layout">
			{/* Imagen en la parte izquierda */}
			<div className="auth-image">
				<img
					src={imagen29}
					alt="Login Illustration"
				/>
			</div>



			<div className="home-container text-center">
				{/* Logo y navegación */}
				


				{/* Título */}
				<h1>MEMORIAMENTE</h1>

				{/* Contenedor del diálogo */}
				<div className="dialog-container mt-4">
					{/* Diálogo animado con color diferenciado */}
					<p className={`dialog-line ${dialogue[currentLine].character.toLowerCase()}-dialog`}>
						<strong>{dialogue[currentLine].character}:</strong> {dialogue[currentLine].text}
					</p>

					{/* Botón para avanzar el diálogo */}
					{currentLine < dialogue.length - 1 ? (
						<button className="btn btn-info mt-3" onClick={nextLine}>
							Siguiente
						</button>
					) : (
						<div>
							{/* Botón de iniciar juego */}
							<Link to="/login">
								<button className="btn btn-success mt-3">¡Empezar a Jugar!</button>
							</Link>
							{/* Botón de registro */}
							<Link to="/signup">
								<button className="btn btn-warning mt-3 mx-2">Regístrate Ahora</button>
							</Link>
						</div>
					)}
				</div>

				{/* Opción para reiniciar el diálogo */}
				{currentLine === dialogue.length - 1 && (
					<button className="btn btn-secondary mt-3" onClick={resetDialogue}>
						Reiniciar Diálogo
					</button>
				)}
			</div>
		</div>
	);
};
