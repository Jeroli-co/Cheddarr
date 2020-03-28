import React, {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus} from "@fortawesome/free-solid-svg-icons";
import {FriendsContext} from "../../../../contexts/FriendsContext";
import {routes} from "../../../../router/routes";
import {Link} from "react-router-dom";

const RequestedList = () => {

  const { requested, cancelFriend } = useContext(FriendsContext);

  return requested.map(pending =>
    <div key={pending.username}>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <figure className="image is-64x64">
              <img src={pending["user_picture"]} alt="User" />
            </figure>
          </div>
          <div className="level-item">
            <Link className="is-size-5" to={routes.USER_FRIEND_PROFILE.url(pending.username)}><i>{'@' + pending.username}</i></Link>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <button className="button is-danger is-small" type="button" onClick={() => cancelFriend(pending.username)}>
              <span className="icon">
                <FontAwesomeIcon icon={faMinus}/>
              </span>
            </button>
          </div>
        </div>
      </div>
      <hr/>
    </div>
  );
};

export {
  RequestedList
}