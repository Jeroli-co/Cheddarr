import React, {useContext, useEffect} from 'react';
import './AuthorizeFacebook.css';
import {AuthContext} from "../../../context/AuthContext";

const AuthorizeFacebook = (props) => {

	const { authorizeFacebook } = useContext(AuthContext);
	useEffect(() => {
		authorizeFacebook(props.location.search);
	}, []);

	return <div/>;
};

export {
	AuthorizeFacebook
};

