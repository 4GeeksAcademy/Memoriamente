import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card } from "./card";
import { Score } from "./score";
import "../../styles/demo.css";
import { Context } from "../store/appContext";

export const Demo = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

   

	return (
		<div className="container text-center my-5">
			<div className="row justify-content-center">
				<div className="col-12 col-md-8 col-lg-6">
					<div className="card-container mb-4">
						<Card />
						
					</div>
					<Link to="/score">
						<button className=" button btn btn-primary">Tabla de Puntuacion</button>
					</Link>
				</div>

				
			</div>
		</div>
	);
};
