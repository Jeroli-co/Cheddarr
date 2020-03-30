import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../../../contexts/AuthContext";

const AuthorizePlex = (props) => {
	const { authorizePlex } = useContext(AuthContext);
	useEffect(() => {
		authorizePlex(props.location.search);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div/>;
};

export {
	AuthorizePlex
};