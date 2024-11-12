import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card } from "./card";
import "../../styles/demo.css";
import { Context } from "../store/appContext";

export const Demo = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await actions.autentificar();
            if (!isAuthenticated) {
                navigate("/"); // Redirigir si el token es inválido o no existe
            }
        };

        checkAuth();
    }, [actions, navigate]);

	return (
		<div className="container text-center my-5">
			<div className="row justify-content-center">
				<div className="col-12 col-md-8 col-lg-6">
					<div className="card-container mb-4">
						<Card />
					</div>
					<Link to="/">
						<button className="btn btn-primary">Back home</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
