import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Card } from "./card";
import "../../styles/demo.css";

import { Context } from "../store/appContext";

export const Demo = () => {
	const { store, actions } = useContext(Context);

	return (
		<>
		<div className="app">
		<div className="card-container">

			<Card />
				
			
		</div>
		</div>
		<Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link>
		</>
	);
};
