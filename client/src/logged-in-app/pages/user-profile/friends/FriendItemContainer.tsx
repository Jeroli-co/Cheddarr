import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../../../../routes";
import styled from "styled-components";
import {
  FadeInUp,
  FadeOutDown,
} from "../../../../shared/components/animations/Animations";
import { Animate } from "../../../../shared/components/animations/Animate";
import { IPublicUser } from "../../../models/IPublicUser";

const FriendItemContainerStyle = styled.div`
  border-bottom: 1px solid #e8e8e8;
  padding: 15px;
  height: 100px;
`;

type FriendItemContainerProps = {
  user: IPublicUser;
  actions: React.ReactNode;
  isShow: boolean;
};

const FriendItemContainer = ({
  user,
  actions,
  isShow,
}: FriendItemContainerProps) => {
  return (
    <Animate
      animationIn={FadeInUp}
      animationOut={FadeOutDown}
      isVisible={isShow}
      size={100}
      duration={0.3}
      count={1}
    >
      <FriendItemContainerStyle className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <figure className="image is-64x64">
              <img src={user["avatar"]} alt="User" />
            </figure>
          </div>
          <div className="level-item">
            <Link
              className="is-size-5"
              to={routes.PUBLIC_USER.url(user.username)}
            >
              <i>{"@" + user.username}</i>
            </Link>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">{actions}</div>
        </div>
      </FriendItemContainerStyle>
    </Animate>
  );
};

export { FriendItemContainer };
