import React from "react";
import {Link} from "react-router-dom";
import {routes} from "../../../../router/routes";
import styled from "styled-components";
import {Animate} from "../../../animations/Animate";
import {FadeInUp, FadeOutDown} from "../../../animations/Animations";

const FriendItemContainerStyle=styled.div`
  border-bottom: 1px solid #e8e8e8;
  padding: 15px;
  height: 100px;
`;

const FriendItemContainer = ({ user, actions, isShow }) => {
  return (
    <Animate animationIn={FadeInUp} animationOut={FadeOutDown} isVisible={isShow} size={100} duration={0.3}>
      <FriendItemContainerStyle className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <figure className="image is-64x64">
              <img src={user["user_picture"]} alt="User" />
            </figure>
          </div>
          <div className="level-item">
            <Link className="is-size-5" to={routes.USER_FRIEND_PROFILE.url(user.username)}><i>{'@' + user.username}</i></Link>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            { actions }
          </div>
        </div>
      </FriendItemContainerStyle>
    </Animate>
  );
};

export {
  FriendItemContainer
}