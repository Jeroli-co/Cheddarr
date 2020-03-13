import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../../../context/AuthContext";

const AuthorizeFacebook = (props) => {

	const { authorizeFacebook } = useContext(AuthContext);
	useEffect(() => {
		authorizeFacebook(props.location.search);
	}, []);

	return <div className="AuthorizeFacebook" data-testid="AuthorizeFacebook"/>;
};

export {
	AuthorizeFacebook
};

