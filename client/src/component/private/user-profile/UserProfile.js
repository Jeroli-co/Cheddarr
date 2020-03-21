import React, {useContext, useEffect, useRef, useState} from 'react';
import {AuthContext} from "../../../context/AuthContext";
import './UserProfile.scss';

const UserProfile = () => {

	const imageUploader = useRef(null);

	const { getUserProfile, changeUserPicture, userPicture } = useContext(AuthContext);
	const [data, setData] = useState(null);
	// const [imgDim, setImgDim] = useState({});

	useEffect(() => {
		getUserProfile().then((data) => setData(data))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const _onImageChange = (e) => {
		const [file] = e.target.files;
		if (file) {
			changeUserPicture(file);
		}
	};

	return (
		<section className="UserProfile is-light is-large" data-testid="UserProfile">
			{ data &&
        <div className="container profile-container">
          <div className="container">
            <input id="input-image" type="file" accept="image/*" onChange={_onImageChange} ref={imageUploader} />
            <div className="is-pointed" onClick={() => imageUploader.current.click()}>
              <img id="user-picture" src={userPicture} alt="User" />
            </div>
            <div className="has-text-left">
              <p className="is-size-5"><i>{'@' + data["username"]}</i></p>
              <p className="is-size-4">Last name: <b>{data["last_name"]}</b></p>
              <p className="is-size-4">First name: <b>{data["first_name"]}</b></p>
              <p className="is-size-4">Email: <b>{data["email"]}</b></p>
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

