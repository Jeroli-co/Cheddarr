import React from "react";
import { useState } from "react";
import {
  faAngleDown,
  faAngleRight,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FriendItemContainer } from "./FriendItemContainer";
import { IUser } from "../../../../shared/models/IUser";
import { IAsyncCall } from "../../../../shared/models/IAsyncCall";
import { Spinner } from "../../../../shared/components/Spinner";
import styled from "styled-components";
import { ClosableTitle } from "../../../../shared/components/ClosableTitle";
import { H3 } from "../../../../shared/components/Titles";
import { DangerIconButton } from "../../../../shared/components/Button";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";
import { Icon } from "../../../../shared/components/Icon";

const Container = styled.div`
  padding: 0 20px 0 0;
  width: 49%;
  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 100%;
    padding: 0;
  }
`;

type FriendsListProps = {
  friends: IAsyncCall<IUser[] | null>;
  removeFriend: (friend: IUser) => void;
};

const FriendsList = ({ friends, removeFriend }: FriendsListProps) => {
  const [showFriendsList, setShowFriendsList] = useState(true);

  const Actions = (friend: IUser) => {
    return (
      <DangerIconButton type="button" onClick={() => removeFriend(friend)}>
        <Icon icon={faMinus} />
      </DangerIconButton>
    );
  };

  return (
    <Container>
      <ClosableTitle onClick={() => setShowFriendsList(!showFriendsList)}>
        <H3>Friends ({friends.data ? friends.data.length : 0})</H3>
        {(showFriendsList && <Icon icon={faAngleDown} size="lg" />) || (
          <Icon icon={faAngleRight} size="lg" />
        )}
      </ClosableTitle>

      {friends.isLoading && <Spinner />}
      {!friends.isLoading &&
        friends.data &&
        friends.data.map((user: IUser) => (
          <FriendItemContainer
            key={user.username}
            user={user}
            actions={<Actions {...user} />}
            isShow={showFriendsList}
          />
        ))}
    </Container>
  );
};

export { FriendsList };
