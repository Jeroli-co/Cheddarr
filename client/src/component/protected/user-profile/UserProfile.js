import React, {useContext, useEffect} from 'react';
import './UserProfile.css';
import {AuthContext} from "../../../context/AuthContext";

function UserProfile() {

	const { info, getProfile } = useContext(AuthContext);
	useEffect(() => {
		if (!info) {
			getProfile();
		}
		console.log('[MOUNTED]');
		console.log(info);
	});

	return (
		<div className="UserProfile">
			{ info &&
				<p>{ info.username } profile !</p>
			}
		</div>
	);
}

export default UserProfile;

