import React from "react";
import { IPublicUser } from "../logged-in-app/models/IPublicUser";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { routes } from "../router/routes";

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Image = styled.img`
  margin-right: 10px;
  width: 64px;
  height: 64px;
`;

type UserSmallCardProps = {
  user: IPublicUser;
};

export const UserSmallCard = ({ user }: UserSmallCardProps) => {
  const history = useHistory();
  return (
    <Container
      onClick={() => history.push(routes.PUBLIC_USER.url(user.username))}
    >
      <Image src={user.avatar} alt="User" />
      <div>{user.username}</div>
    </Container>
  );
};
