import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevenir que el formulario recargue la página

        try {
            // Realiza la llamada a la acción de login
            const response = await actions.login(email, password);

            // Si la autenticación es exitosa
            console.log("Inicio de sesión exitoso");

            // Limpiar los campos de entrada
            setEmail("");
            setPassword("");

            // Redirigir al usuario a la ruta privada
            navigate("/demo");
        } catch (error) {
            // Manejo de errores
            alert("Error en el login: " + error.message);
        }
    };

    return (
        <div className="d-flex justify-content-center mt-5">
            <form onSubmit={handleSubmit}className="p-4 bg-dark text-white rounded">
                <h1 className="titulo">Login</h1>

                {/* Campo de email */}
                <div className="mb-3">
                    <label htmlFor="Email" className="form-label">Email address</label>
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="name@example.com"
                        autoComplete="off"
                        // el REQUIRED es para asegurarte de que el usuario no pueda enviar el formulario sin completar los campo.
                        required
                        className="form-control"
                        aria-describedby="emailHelp"
                    />
                </div>

                {/* Campo de contraseña */}
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="password"
                    autoComplete="off"
                    // el REQUIRED es para asegurarte de que el usuario no pueda enviar el formulario sin completar los campo.
                    required
                    className="form-control"

                   
                />
                   
                </div>
               

                {/* Botón de enviar */}
                <button type="submit" className="boton me-3">
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default Login;
