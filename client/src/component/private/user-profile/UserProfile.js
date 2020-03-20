import React, {useContext, useEffect, useRef, useState} from 'react';
import {AuthContext} from "../../../context/AuthContext";

const UserProfile = () => {

	const uploadedImage = useRef(null);
	const imageUploader = useRef(null);

	const { getUserProfile, changeUserPicture, userPicture } = useContext(AuthContext);
	const [data, setData] = useState(null);
	const [status, setStatus] = useState(null);

	useEffect(() => {
		getUserProfile().then((data) => setData(data))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const _onImageChange = (e) => {
		const [file] = e.target.files;
		if (file) {
			console.log(file);
			changeUserPicture(file).then((status) => {
				console.log("Image updated");
				setStatus(status);
			});
		}
	};

	return (
		<div className="UserProfile container" data-testid="UserProfile">
			{ data &&
				<article className="media">
					<div className="media-left">
						<input type="file" accept="image/*" onChange={_onImageChange} ref={imageUploader} style={{ display: "none" }} />
						<figure className="image is-128x128 is-pointed" onClick={() => imageUploader.current.click()}>
							<img src={userPicture} alt="User" />
						</figure>
					</div>
					<div className="media-content">
						<div className="content">
							<p>
								<strong>{data.last_name + ' ' + data.first_name + ' '}</strong>
								<small>{'@' + data.username}</small>
							</p>
						</div>
					</div>

					{ status && <div/> }

				</article>
			}
		</div>
	);
};

export {
	UserProfile
};

