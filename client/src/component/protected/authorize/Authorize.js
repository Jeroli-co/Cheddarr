import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../../../context/AuthContext";

const Authorize = (props) => {

	const { refreshSession } = useContext(AuthContext);
	useEffect(() => {
		refreshSession(props.location.search);
	}, []);

	return <div/>;
};

export {
	Authorize
};

