import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../../../contexts/AuthContext";
import {routes} from "../../../router/routes";

const AuthorizePlex = (props) => {

	const { authorizePlex } = useContext(AuthContext);

	useEffect(() => {
		authorizePlex(props.location.search).then((res) => {
			if (res) {
 				switch (res.status) {
 					case 200:
 						let redirectURI = res.headers["redirect-uri"];
 						redirectURI = redirectURI.length > 0 ? redirectURI : routes.HOME.url;
 						props.history.push(redirectURI);
 						return;
 					default:
 						return null;
 				}
 			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div/>;
};

export {
	AuthorizePlex
};