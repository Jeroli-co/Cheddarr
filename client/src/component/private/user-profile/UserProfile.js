import React, {useContext} from 'react';
import {AuthContext} from "../../../context/AuthContext";

function UserProfile() {

	const { username } = useContext(AuthContext);

	return (
		<div className="UserProfile" data-testid="UserProfile">
			<p>{ username } profile !</p>
		</div>
	);
}

export {
	UserProfile
};

