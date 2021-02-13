import React from "react";
import { AddFriendsInput } from "./AddFriendsInput";
import { FriendsList } from "./FriendsList";
import { RequestedList } from "./RequestedList";
import { ReceivedList } from "./ReceivedList";
import { useFriends } from "../../../../shared/hooks/useFriends";
import styled from "styled-components";
import { PrimaryDivider } from "../../../../shared/components/Divider";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";
import { useWindowSize } from "../../../../shared/hooks/useWindowSize";

const Container = styled.div`
  user-select: none;
`;

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FriendRequestContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 100%;
  }
`;

const Friends = () => {
  const {
    friends,
    friendsRequestReceived,
    friendsRequestSent,
    removeFriend,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    refuseFriendRequest,
  } = useFriends();

  const { width } = useWindowSize();

  return (
    <Container>
      <AddFriendsInput sendFriendRequest={sendFriendRequest} />
      <PrimaryDivider />
      <ListContainer>
        <FriendsList friends={friends} removeFriend={removeFriend} />
        {width <= STATIC_STYLES.TABLET_MAX_WIDTH && <PrimaryDivider />}
        <FriendRequestContainer>
          <ReceivedList
            received={friendsRequestReceived}
            acceptRequest={acceptFriendRequest}
            refuseRequest={refuseFriendRequest}
          />
          <PrimaryDivider />
          <RequestedList
            requested={friendsRequestSent}
            cancelRequest={cancelFriendRequest}
          />
        </FriendRequestContainer>
      </ListContainer>
    </Container>
  );
};

export { Friends };
