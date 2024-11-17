import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

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
    const handleRecovery = () => {
        console.log("Recuperar contraseña para: ", recoveryEmail);
        // Aquí puedes llamar a una acción para enviar el email de recuperación
        alert(`Se ha enviado un correo a ${recoveryEmail} para recuperar la contraseña.`);
        setRecoveryEmail(""); // Limpia el email
        setShowModal(false); // Cierra el modal
    };

    return (
        <div className="d-flex justify-content-center mt-5">
            <form onSubmit={handleSubmit} className="p-4 bg-dark text-white rounded">
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
                        required
                        className="form-control"
                    />
                </div>

                {/* Botón de enviar */}
                <button type="submit" className="boton me-3">
                    Enviar
                </button>

                {/* Botón para abrir el modal */}
                <div className="ml-auto">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)} // Mostrar el modal
                    >
                        Olvidó contraseña
                    </button>
                </div>
            </form>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Recuperar Contraseña</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)} // Cerrar el modal
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Introduce tu correo electrónico para recuperar tu contraseña.</p>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Correo electrónico"
                                    value={recoveryEmail}
                                    onChange={(e) => setRecoveryEmail(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
