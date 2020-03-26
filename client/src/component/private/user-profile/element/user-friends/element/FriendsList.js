import {Link} from "react-router-dom";
import {routes} from "../../../../../../router/routes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus} from "@fortawesome/free-solid-svg-icons";
import React, {useContext} from "react";
import {FriendsContext} from "../../../../../../context/FriendsContext";

const FriendsList = () => {

  const { friends, deleteFriend } = useContext(FriendsContext);

  return friends.map((friend) => {
    return (
      <div key={friend.username}>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <figure className="image is-64x64">
                <img src={friend["user_picture"]} alt="User"/>
              </figure>
            </div>
            <div className="level-item">
              <Link className="is-size-5" to={routes.USER_FRIEND_PROFILE.url(friend.username)}><i>{'@' + friend.username}</i></Link>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button className="button is-danger is-small" type="button" onClick={() => deleteFriend(friend.username)}>
                  <span className="icon">
                    <FontAwesomeIcon icon={faMinus}/>
                  </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

export {
  FriendsList
}