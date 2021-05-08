import React, { useState } from "react";
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
import { Icon } from "../../../../shared/components/Icon";

const Container = styled.div`
  width: 100%;
`;

type FriendsRequestedListProps = {
  requested: IAsyncCall<IUser[] | null>;
  cancelRequest: (friend: IUser) => void;
};

const RequestedList = ({
  requested,
  cancelRequest,
}: FriendsRequestedListProps) => {
  const [showRequestedList, setShowRequestedList] = useState(false);

  const Actions = (friend: IUser) => {
    return (
      <DangerIconButton type="button" onClick={() => cancelRequest(friend)}>
        <Icon icon={faMinus} />
      </DangerIconButton>
    );
  };

  return (
    <Container>
      <ClosableTitle onClick={() => setShowRequestedList(!showRequestedList)}>
        <H3>Requested ({requested.data ? requested.data.length : 0})</H3>
        {(showRequestedList && <Icon icon={faAngleDown} size="lg" />) || (
          <Icon icon={faAngleRight} size="lg" />
        )}
      </ClosableTitle>

      {showRequestedList && requested.isLoading && <Spinner />}
      {!requested.isLoading &&
        requested.data &&
        requested.data.map((user) => (
          <FriendItemContainer
            key={user.username}
            user={user}
            actions={<Actions {...user} />}
            isShow={showRequestedList}
          />
        ))}
    </Container>
  );
};

export { RequestedList };
