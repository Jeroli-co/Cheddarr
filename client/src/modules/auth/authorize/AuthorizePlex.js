import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../../../contexts/AuthContext";

const AuthorizePlex = (props) => {
	const { authorizePlex } = useContext(AuthContext);
	useEffect(() => {
		authorizePlex(props.location.search);
	}, []);

	return <div/>;
};

export {
	AuthorizePlex
};