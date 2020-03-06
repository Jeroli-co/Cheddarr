import React, {useContext, useEffect} from 'react';
import './AuthorizeGoogle.css';
import {AuthContext} from "../../../context/AuthContext";

const AuthorizeGoogle = (props) => {

	const { authorizeGoogle } = useContext(AuthContext);
	useEffect(() => {
		authorizeGoogle(props.location.search);
	}, []);

	return <div/>;
};

export {
	AuthorizeGoogle
};

