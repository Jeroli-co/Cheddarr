import React, {useContext, useEffect, useRef, useState} from 'react';
import {AuthContext} from "../../../context/AuthContext";
import './UserProfile.scss';

const UserProfile = () => {

	const imageUploader = useRef(null);

	const { getUserProfile, changeUserPicture, username, userPicture } = useContext(AuthContext);
	const [httpResponse, setHttpResponse] = useState(null);

	useEffect(() => {
		getUserProfile().then(res => {
			switch (res.status) {
				case 200:
					setHttpResponse(res);
					return;
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const _onImageChange = (e) => {
		const [file] = e.target.files;
		if (file) {

			const fileSize = ((file.size/1024)/1024).toFixed(4);
			if (fileSize > 1) {
				alert("File size must be lower than 1MB");
				return;
			}

			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = e => {
				const image = new Image();
				image.src = e.target["result"];
				image.onload = e => {
					const width = e.target["width"];
					const height = e.target["height"];
					if (width > 1024 || height > 1024) {
						alert("Image width and height must be lower than 512px");
					} else {
						changeUserPicture(file);
					}
				};
			};

		}
	};

	return (
		<section className="UserProfile is-light is-large" data-testid="UserProfile">
			{ httpResponse &&
        <div className="container profile-container">
          <div className="container">
            <input id="input-image" type="file" accept="image/*" onChange={_onImageChange} ref={imageUploader} />
            <img id="user-picture" src={userPicture} alt="User" onClick={() => imageUploader.current.click()} />
            <div className="has-text-left">
              <p className="is-size-5"><i>{'@' + username}</i></p>
              <p className="is-size-4">Email: <b>{httpResponse.data.email}</b></p>
            </div>
          </div>
        </div>
			}
		</section>
	);
};

export {
	UserProfile
};

