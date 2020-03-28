import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FriendsContext} from "../../../../contexts/FriendsContext";
import {routes} from "../../../../router/routes";
import {Link} from "react-router-dom";

const ReceivedList = () => {

  const { received, acceptRequest, refuseFriend } = useContext(FriendsContext);

  return received.map(request =>
    <div key={request.username}>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <figure className="image is-64x64">
              <img src={request["user_picture"]} alt="User" />
            </figure>
          </div>
          <div className="level-item">
            <Link className="is-size-5" to={routes.USER_FRIEND_PROFILE.url(request.username)}><i>{'@' + request.username}</i></Link>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <div className="buttons">
              <button className="button is-success is-small" type="button" onClick={() => acceptRequest(request.username)}>
                <span className="icon">
                  <FontAwesomeIcon icon={faCheck}/>
                </span>
              </button>
              <button className="button is-danger is-small" type="button" onClick={() => refuseFriend(request.username)}>
                <span className="icon">
                  <FontAwesomeIcon icon={faTimes}/>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr/>
    </div>
  );
};

export {
  ReceivedList
}