import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../../../context/AuthContext";

const AuthorizeGoogle = (props) => {

	const { authorizeGoogle } = useContext(AuthContext);
	useEffect(() => {
		authorizeGoogle(props.location.search);
	}, []);

	return <div className="AuthorizeGoogle" data-testid="AuthorizeGoogle"/>;
};

export {
	AuthorizeGoogle
};

