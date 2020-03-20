import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../../context/AuthContext";

const UserProfile = () => {

	const { getUserProfile } = useContext(AuthContext);
	const [data, setData] = useState(null);

	useEffect(() => {
		getUserProfile().then((data) => {setData(data)})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="UserProfile container" data-testid="UserProfile">
			{ data &&
				<article className="media">
					<figure className="media-left">
						<p className="image is-128x128">
							<img src={data.user_picture} alt="User" />
						</p>
					</figure>
					<div className="media-content">
						<div className="content">
							<p>
								<strong>{data.last_name + ' ' + data.first_name + ' '}</strong>
								<small>{'@' + data.username}</small>
							</p>
						</div>
					</div>
				</article>
			}
		</div>
	);
};

export {
	UserProfile
};

