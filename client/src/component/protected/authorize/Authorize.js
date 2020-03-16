import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../../../context/AuthContext";

const Authorize = (props) => {

	const { refreshSession } = useContext(AuthContext);
	useEffect(() => {
		refreshSession(props.location.search);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div/>;
};

export {
	Authorize
};

