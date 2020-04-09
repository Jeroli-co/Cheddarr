import React, {useContext, useEffect, useRef, useState} from 'react';
import './Profile.scss';
import {routes} from "../../router/routes";
import {Link} from "react-router-dom";
import {Route} from "react-router-dom";
import {AuthContext} from "../../contexts/AuthContext";
import {NotificationContext} from "../../contexts/NotificationContext";
import {useProfile} from "../../hooks/useProfile";

const Profile = () => {

	const imageUploader = useRef(null);

	const { getUser, changeUserPicture } = useProfile();
	const { username, userPicture } = useContext(AuthContext);
	const [user, setUser] = useState(null);
	const { pushDanger } = useContext(NotificationContext);

	useEffect(() => {
		getUser().then(res => { if (res) setUser(res.data) });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const _onImageChange = (e) => {
		const [file] = e.target.files;
		if (file) {
			// Check file size
			const fileSize = ((file.size/1024)/1024).toFixed(4);
			if (fileSize > 1) {
				pushDanger("File size must be lower than 1MB");
				return;
			}
			// Check image size
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				const image = new Image();
				image.src = e.target["result"];
				image.onload = async (e) => {
					const width = e.target["width"];
					const height = e.target["height"];
					if (width > 1024 || height > 1024) {
						pushDanger("Image width and height must be lower than 512px");
					} else {
						await changeUserPicture(file);
					}
				};
			};

		}
	};

	return (
		<section className="Profile container is-fluid" data-testid="Profile">

			<br/>

			<div className="columns is-desktop is-fullwidth">

				<div className="column is-one-quarter-desktop">
					{ user &&
						<div className="tile is-ancestor" data-testid="UserProfileContainer">
							<div className="tile is-parent is-vertical">
								<div className="tile is-child has-text-centered">
									<input id="input-image" type="file" accept="image/*" onChange={_onImageChange} ref={imageUploader} />
									<img id="user-picture" src={userPicture} alt="User" width={260} height={260} onClick={() => imageUploader.current.click()} data-testid="UserProfileImage" />
								</div>
								<div className="tile is-child has-text-centered">
									<p className="is-size-5" data-testid="UserProfileUsername"><i>{'@' + username}</i></p>
									<p className="is-size-5" data-testid="UserProfileEmail">{user.email}</p>
								</div>
							</div>
						</div>
					}
				</div>

				<div className="column">
					<div className="tabs is-boxed">
						<ul>
							<li className="is-active">
								<Link to={routes.USER_FRIENDS.url}>
									Friends
								</Link>
							</li>
						</ul>
					</div>

					<Route path={[routes.USER_PROFILE.url, routes.USER_FRIENDS.url]} component={routes.USER_FRIENDS.component} />

				</div>

			</div>

		</section>
	);
};

export {
	Profile
};

