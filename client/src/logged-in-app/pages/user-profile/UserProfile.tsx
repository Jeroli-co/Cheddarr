import React from "react";
import styled from "styled-components";
import { useCurrentUser } from "../../../shared/hooks/useCurrentUser";
import { SwitchErrors } from "../../../shared/components/errors/SwitchErrors";
import { Spinner } from "../../../shared/components/Spinner";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 40px;

  p {
    margin-top: 20px;
  }
`;

const UserPictureStyle = styled.img`
  width: 260px;
  height: 260px;
`;

const UserProfile = () => {
  const user = useCurrentUser();

  if (user.isLoading)
    return (
      <Container>
        <Spinner />
      </Container>
    );

  if (user.data === null) return <SwitchErrors status={user.status} />;

  return (
    <Container>
      <UserPictureStyle src={user.data.avatar} alt="User" />
      <p>
        <i>{"@" + user.data.username}</i>
      </p>
      <p>{user.data.email}</p>
    </Container>
  );
};

export { UserProfile };
