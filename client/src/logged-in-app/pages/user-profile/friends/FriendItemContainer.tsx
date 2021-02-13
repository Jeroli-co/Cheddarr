import React from "react";
import styled from "styled-components";
import {
  FadeInUp,
  FadeOutDown,
} from "../../../../shared/components/animations/Animations";
import { Animate } from "../../../../shared/components/animations/Animate";
import { IPublicUser } from "../../../../shared/models/IPublicUser";
import { UserSmallCard } from "../../../../shared/components/UserSmallCard";
import { Row } from "../../../../shared/components/layout/Row";

const FriendItemContainerStyle = styled.div`
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
      <FriendItemContainerStyle>
        <Row justifyContent="space-between" alignItems="center">
          <UserSmallCard user={user} />
          <div>{actions}</div>
        </Row>
      </FriendItemContainerStyle>
    </Animate>
  );
};

export { FriendItemContainer };
