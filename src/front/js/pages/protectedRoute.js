import React, { useContext, useEffect } from 'react';
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            const isAuthenticated = await actions.autentificar();
            if (!isAuthenticated) {
                navigate('/login');  // Redirigir a login si no está autenticado
            }
        };

        verifyAuth();
    }, [store.auth]);

    return store.auth ? children : null;
};

export default ProtectedRoute;
