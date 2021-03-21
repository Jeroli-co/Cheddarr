import React from "react";
import styled from "styled-components";
import { useCurrentUser } from "../../../shared/hooks/useCurrentUser";
import { SwitchErrors } from "../../../shared/components/errors/SwitchErrors";
import { Spinner } from "../../../shared/components/Spinner";
import { UpdateProfile } from "./account/UpdateProfile";
import { H1 } from "../../../shared/components/Titles";
import { STATIC_STYLES } from "../../../shared/enums/StaticStyles";
import { PrimaryDivider } from "../../../shared/components/Divider";
import { Friends } from "./friends/Friends";
import { useWindowSize } from "../../../shared/hooks/useWindowSize";

const SubContainer = styled.div`
  display: flex;
  text-align: center;
  width: 100%;
  flex-wrap: wrap;
`;

const InfosContainer = styled.div`
  p {
    margin-top: 10px;
  }

  .username {
    font-weight: bold;
  }

  width: 20%;
  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 100%;
  }
`;

const UserFriends = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  @media screen and (min-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 80%;
  }
`;

const UserPictureStyle = styled.img`
  width: 75%;
  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 50%;
  }
`;

const Profile = () => {
  const user = useCurrentUser();
  const { width } = useWindowSize();

  if (user.isLoading) return <Spinner />;

  if (user.data === null) return <SwitchErrors status={user.status} />;

  return (
    <>
      <H1>Account</H1>
      <PrimaryDivider />
      <div>
        <SubContainer>
          <InfosContainer>
            <UserPictureStyle src={user.data.avatar} alt="User" />
            <p className="username">
              <i>{"@" + user.data.username}</i>
            </p>
            <p>{user.data.email}</p>
          </InfosContainer>
          {width <= STATIC_STYLES.TABLET_MAX_WIDTH && <PrimaryDivider />}
          <UserFriends>
            <Friends />
          </UserFriends>
        </SubContainer>
        <PrimaryDivider />
        <UpdateProfile />
      </div>
    </>
  );
};

export { Profile };
