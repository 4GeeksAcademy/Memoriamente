import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css"; // Usamos el mismo archivo de estilos
import imagen42 from "../../img/42.png"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
    const [recoveryEmail, setRecoveryEmail] = useState(""); // Estado para el email de recuperación
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir que el formulario recargue la página
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

    // Función para manejar la recuperación de contraseña
    const handleRecovery = async () => {
        if (!recoveryEmail) {
            alert("Por favor, introduce un correo válido.");
            return;
        }
    
        const result = await actions.recoverPassword(recoveryEmail); // Llama a la acción
    
        if (result.success) {
            alert(result.msg); // Muestra el mensaje de éxito
            setRecoveryEmail(""); // Limpia el email
            setShowModal(false); // Cierra el modal
        } else {
            alert(result.msg); // Muestra el mensaje de error
        }
    };

    return (

        <div className="auth-layout">
            {/* Imagen en la parte izquierda */}
            <div className="auth-image">
                <img
                    src={imagen42}
                    alt="Login Illustration"
                />
            </div>

            <div className="auth-container">
                {/* Título */}
                <h1 className="auth-title">Iniciar Sesión</h1>
                {/* Formulario */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Campo de email */}
                    <div className="mb-3">
                        <label htmlFor="Email" className="form-label">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="name@example.com"
                            autoComplete="off"
                            required
                            className="form-control"
                            aria-describedby="emailHelp"
                        />
                    </div>

                    {/* Campo de contraseña */}
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Contraseña"
                            autoComplete="off"
                            required
                            className="form-control"
                        />
                    </div>

                    {/* Botón de enviar */}
                    <button type="submit" className="boton me-3">
                        Iniciar Sesión
                    </button>

                    {/* Botón para abrir el modal */}
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)} // Mostrar el modal
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </form>

                {/* Modal */}
                {showModal && (
                    <div
                        className="auth-container modal-container"
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.9)", // Fondo semitransparente oscuro
                            boxShadow: "0 0 20px #00ff00", // Sombra verde brillante
                        }}
                    >
                        {/* Estructura del modal */}
                        <h2 className="auth-title">Recuperar Contraseña</h2>
                        <form className="auth-form">
                            <div className="mb-3">
                                <label className="form-label">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="name@example.com"
                                    value={recoveryEmail}
                                    onChange={(e) => setRecoveryEmail(e.target.value)}
                                />
                            </div>
                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="boton me-2"
                                    onClick={() => setShowModal(false)} // Cerrar el modal
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleRecovery} // Llamar a la función de recuperación
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
