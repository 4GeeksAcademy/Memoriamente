import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";


const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { actions, store } = useContext(Context)
    const navigate = useNavigate();

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevenir que el formulario recargue la página

        try {
            await actions.signup(email, password);
            console.log("Has pasado correctamente el registro");
            setEmail(""); // Limpiar el campo de email
            setPassword(""); // Limpiar el campo de password
            navigate("/login");
        } catch (error) {
            // Manejo de errores
            alert(error);
        }
    };




    return (
        <div className="d-flex justify-content-center mt-5">


            <form onSubmit={handleSubmit} className="p-4 bg-dark text-white rounded">
                <h1 className="titulo ms-3">Registro</h1>

                 {/* Campo de email */}

                <div className="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email address</label>
                    <input type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email} placeholder="name@example.com"
                        autoComplete="new-email"
                        // el REQUIRED es para asegurarte de que el usuario no pueda enviar el formulario sin completar los campo.
                        required
                        className="form-control"
                        aria-describedby="emailHelp" />
                </div>

                 {/* Campo de contraseña */}

                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} placeholder="password" 
                    autoComplete="new-password"
                    // el REQUIRED es para asegurarte de que el usuario no pueda enviar el formulario sin completar los campo.
                    required
                    className="form-control" />
                </div>               

                <button type="submit" className=" boton  me-3">
                    Enviar
                </button>

            </form>

        </div>
    )
}

export default Signup