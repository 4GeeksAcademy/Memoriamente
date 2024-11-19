import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/resetPassword.css"; 

const ResetPassword = () => {
  const { actions } = useContext(Context); // Acceder a las acciones de Flux

  // Estado para token, contraseña, y mensaje
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setToken(urlParams.get("token")); // Extraer el token de la URL
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    const result = await actions.resetPassword(password, token); // Llamar a la acción resetPassword

    if (result.success) {
      setMessage("¡Contraseña actualizada con éxito!");
    } else {
      setMessage(result.msg || "Error al restablecer la contraseña");
    }
  };

  return (
    <div className="rick-and-morty-container">
      <form onSubmit={handleSubmit} className="rick-and-morty-form">
        <h1 className="rick-and-morty-title">Restablecer Contraseña</h1> {/* Título principal */}

        {message && (
          <p
            className={`rick-and-morty-alert ${
              message.includes("éxito")
                ? "rick-and-morty-success"
                : "rick-and-morty-error"
            }`}
          >
            {message} {/* Muestra el mensaje de error o éxito */}
          </p>
        )}

        <div className="rick-and-morty-field">
          <label htmlFor="password">Nueva contraseña:</label> {/* Etiqueta para la nueva contraseña */}
          <input
            type="password" // Campo de entrada para contraseñas
            id="password"
            value={password} // Enlaza el valor del campo al estado 'password'
            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado cuando el usuario escribe
            placeholder="Escribe tu nueva contraseña" // Placeholder para la contraseña
            required // Campo obligatorio
          />
        </div>

        <div className="rick-and-morty-field">
          <label htmlFor="confirmPassword">Confirmar contraseña:</label> {/* Etiqueta para confirmar contraseña */}
          <input
            type="password" // Campo de entrada para confirmar la contraseña
            id="confirmPassword"
            value={confirmPassword} // Enlaza el valor del campo al estado 'confirmPassword'
            onChange={(e) => setConfirmPassword(e.target.value)} // Actualiza el estado cuando el usuario escribe
            placeholder="Confirma tu nueva contraseña" // Placeholder para la confirmación
            required // Campo obligatorio
          />
        </div>

        <button type="submit" className="rick-and-morty-button">
          Restablecer contraseña
        </button> {/* Botón para enviar el formulario */}
      </form>
    </div>
  );
};

export default ResetPassword; // Exporta el componente para ser usado en otros archivos
