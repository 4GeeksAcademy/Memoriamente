import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/auth.css"; 

const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const [user, setUser] = useState({
        name: "",
        lastname: "",
        email: "",
    });

    useEffect(() => {
        let isMounted = true; // Flag para evitar actualizaciones si el componente se desmonta

        const fetchUserData = async () => {
            try {
                const storedUser = await actions.getUserData(localStorage.getItem("user_id")); // Obtener datos del usuario
                if (isMounted && storedUser) {
                    setUser(storedUser); // Actualizar el estado una sola vez
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();

        return () => {
            isMounted = false; // Cleanup
        };
    }, []);

    const handleEdit = async (e) => {
        e.preventDefault();
        const { email, ...editableFields } = user; // Excluye el correo electrónico
        const success = await actions.editUser(editableFields); // Enviar solo los campos editables
        if (success) {
            alert("Tu información ha sido actualizada.");
            actions.logout();
            window.location.href = "/"; // Redirige a la página de inicio
        } else {
            alert("Ocurrió un error al actualizar tu información.");
        }
    };
    

    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar tu cuenta?")) {
            const success = await actions.deleteUser(user.id);
            if (success) {
                alert("Tu cuenta ha sido eliminada.");
                actions.logout(); // Cierra sesión después de eliminar
                window.location.href = "/"; // Redirige a la página de inicio
            } else {
                alert("Ocurrió un error al eliminar tu cuenta.");
            }
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Mi Perfil</h1>
            <form onSubmit={handleEdit} className="auth-form">
                <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={user.name || ""} // Asegura que no sea undefined
                        onChange={(e) => setUser({ ...user, name: e.target.value })} // Actualiza el estado
                        placeholder="Nombre"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Apellido:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={user.lastname || ""} // Asegura que no sea undefined
                        onChange={(e) =>
                            setUser({ ...user, lastname: e.target.value })
                        } // Actualiza el estado
                        placeholder="Apellido"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={user.email || ""} // Asegura que no sea undefined
                        readOnly // Hace el campo no editable
                        placeholder="name@example.com"
                        required
                    />
                </div>
                <button type="submit" className="boton">
                    Guardar Cambios
                </button>
                <button
                    type="button"
                    className="boton boton-eliminar"
                    onClick={handleDelete}
                >
                    Eliminar Cuenta
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
