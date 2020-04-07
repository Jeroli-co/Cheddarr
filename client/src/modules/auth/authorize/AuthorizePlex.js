import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../../../contexts/AuthContext";
import {routes} from "../../../router/routes";

const AuthorizePlex = (props) => {

	const { authorizePlex } = useContext(AuthContext);

	useEffect(() => {
		console.log("Authorizing plex");
		authorizePlex(props.location.search);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div/>;
};

export {
	AuthorizePlex
};