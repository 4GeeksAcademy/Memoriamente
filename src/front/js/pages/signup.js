import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";


const Signup = () => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [lastname, setLastname] = useState("")
    const [seudonimo, setSeudonimo] = useState("")
    const [password, setPassword] = useState("")

    const { actions, store } = useContext(Context)
    const navigate = useNavigate();

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevenir que el formulario recargue la página

        try {
            await actions.signup(name, lastname, seudonimo, email, password);
            console.log("Has pasado correctamente el registro");
            setName("");
            setLastname("");
            setSeudonimo("");
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


                 {/* Campo de nombre */}

                 <div className="mb-3">
                    <label htmlFor="Name" className="form-label">Nombre</label>
                    <input type="Nombre"
                        onChange={(e) => setName(e.target.value)}
                        value={name} placeholder="Nombre"
                        autoComplete=""
                        // el REQUIRED es para asegurarte de que el usuario no pueda enviar el formulario sin completar los campo.
                        required
                        className="form-control"
                        aria-describedby="nameHelp" />  
                </div>



                 {/* Campo de apellido */}

                 <div className="mb-3">
                    <label htmlFor="lastname" className="form-label">Apellido</label>
                    <input type="Apellido"
                        onChange={(e) => setLastname(e.target.value)}
                        value={lastname} placeholder="Apellido"
                        autoComplete=""
                        // el REQUIRED es para asegurarte de que el usuario no pueda enviar el formulario sin completar los campo.
                        required
                        className="form-control"
                        aria-describedby="lastnameHelp" />
                </div>

                {/* Campo de seudonimo */}

                <div className="mb-3">
                    <label htmlFor="seudonimo" className="form-label">Seudonimo</label>
                    <input type="Seudonimo"
                        onChange={(e) => setSeudonimo(e.target.value)}
                        value={seudonimo} placeholder="Seudonimo"
                        autoComplete=""
                        // el REQUIRED es para asegurarte de que el usuario no pueda enviar el formulario sin completar los campo.
                        required
                        className="form-control"
                        aria-describedby="lastnameHelp" />
                </div>

                 {/* Campo de email */}

                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
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

                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
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