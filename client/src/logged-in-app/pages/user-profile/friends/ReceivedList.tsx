import React, { useState } from "react";
import {
  faAngleDown,
  faAngleRight,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FriendItemContainer } from "./FriendItemContainer";
import { IPublicUser } from "../../../../shared/models/IPublicUser";
import { IAsyncCall } from "../../../../shared/models/IAsyncCall";
import { Spinner } from "../../../../shared/components/Spinner";
import styled from "styled-components";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import {
  DangerIconButton,
  SuccessIconButton,
} from "../../../../shared/components/Button";
import { ClosableTitle } from "../../../../shared/components/ClosableTitle";
import { H3 } from "../../../../shared/components/Titles";
import { Icon } from "../../../../shared/components/Icon";

const Container = styled.div`
  width: 100%;
`;

type FriendsReceivedListProps = {
  received: IAsyncCall<IPublicUser[] | null>;
  acceptRequest: (friend: IPublicUser) => void;
  refuseRequest: (friend: IPublicUser) => void;
};

const ReceivedList = ({
  received,
  acceptRequest,
  refuseRequest,
}: FriendsReceivedListProps) => {
  const [showReceivedList, setShowReceivedList] = useState(false);

  const Actions = (friend: IPublicUser) => {
    return (
      <Buttons>
        <SuccessIconButton type="button" onClick={() => acceptRequest(friend)}>
          <Icon icon={faCheck} />
        </SuccessIconButton>
        <DangerIconButton type="button" onClick={() => refuseRequest(friend)}>
          <Icon icon={faTimes} />
        </DangerIconButton>
      </Buttons>
    );
  };

  return (
    <Container>
      <ClosableTitle onClick={() => setShowReceivedList(!showReceivedList)}>
        <H3>Received ({received.data ? received.data.length : 0})</H3>
        {(showReceivedList && <Icon icon={faAngleDown} size="lg" />) || (
          <Icon icon={faAngleRight} size="lg" />
        )}
      </ClosableTitle>

      {showReceivedList && received.isLoading && <Spinner />}
      {!received.isLoading &&
        received.data &&
        received.data.map((user) => (
          <FriendItemContainer
            key={user.username}
            user={user}
            actions={<Actions {...user} />}
            isShow={showReceivedList}
          />
        ))}
    </Container>
  );
};

export { ReceivedList };
