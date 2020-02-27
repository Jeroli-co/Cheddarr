import React, {useContext} from 'react';
import './UserProfile.css';
import {AuthContext} from "../../../context/AuthContext";

function UserProfile() {

	const { username } = useContext(AuthContext);

	return (
		<div className="UserProfile">
			<p>{ username } profile !</p>
		</div>
	);
}

export default UserProfile;

