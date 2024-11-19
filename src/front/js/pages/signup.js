import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css"; // Importar estilos

const Signup = () => {
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [seudonimo, setSeudonimo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actions.signup(name, lastname, seudonimo, email, password);
            setName("");
            setLastname("");
            setSeudonimo("");
            setEmail("");
            setPassword("");
            navigate("/login");
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Registro</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                        type="text"
                        className="form-control"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        placeholder="Apellido"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Seudónimo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={seudonimo}
                        onChange={(e) => setSeudonimo(e.target.value)}
                        placeholder="Seudónimo"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                    />
                </div>
                <button type="submit" className="boton">
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Signup;
