import React, { useState, useEffect } from "react";
import "../../styles/resetPassword.css"; // Archivo CSS con el estilo Rick and Morty

const ResetPassword = () => {
  // Estados para almacenar el token, la nueva contraseña, la confirmación de la contraseña y los mensajes
  const [token, setToken] = useState(""); // Token para autenticación
  const [password, setPassword] = useState(""); // Nueva contraseña ingresada
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmación de la nueva contraseña
  const [message, setMessage] = useState(""); // Mensaje para mostrar resultados o errores

  // Extrae el token de la URL cuando el componente se monta
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search); // Obtiene los parámetros de la URL
    const tokenFromURL = urlParams.get("token"); // Extrae el token del parámetro 'token'
    setToken(tokenFromURL); // Guarda el token en el estado
  }, []); // El arreglo vacío asegura que este efecto se ejecute solo una vez al montar el componente

  // Maneja el envío del formulario para actualizar la contraseña
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario (recargar la página)

    // Validación: Verifica que las contraseñas coincidan
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden"); // Muestra un mensaje de error si no coinciden
      return; // Detiene el proceso de envío
    }

    try {
      // Realiza una solicitud a la API para restablecer la contraseña
      const response = await fetch(
        "http://improved-space-fortnight-7vv9rvwq6x9gfpx4-3001.app.github.dev/reset-password",
        {
          method: "POST", // Método POST para enviar datos
          headers: {
            "Content-Type": "application/json", // Indica que el cuerpo de la solicitud es JSON
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado para autenticación
          },
          body: JSON.stringify({ password }), // Envía la nueva contraseña como JSON en el cuerpo de la solicitud
        }
      );

      const data = await response.json(); // Extrae la respuesta en formato JSON

      // Si la solicitud fue exitosa
      if (response.ok) {
        setMessage("¡Contraseña actualizada con éxito!"); // Muestra un mensaje de éxito
      } else {
        // Si hubo un error, muestra el mensaje proporcionado por el servidor o un mensaje genérico
        setMessage(data.msg || "Error al restablecer la contraseña");
      }
    } catch (error) {
      console.error("Error:", error); // Muestra el error en la consola para depuración
      setMessage("Hubo un error al conectarse con el servidor"); // Muestra un mensaje de error genérico
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
