import { IUser } from "../models/IUser";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes";

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
  user: IUser;
};

export const UserSmallCard = ({ user }: UserSmallCardProps) => {
  const navigate = useNavigate();
  return (
    <Container onClick={() => navigate(routes.PROFILE.url(user.id))}>
      <Image src={user.avatar} alt="User" />
      <div>{user.username}</div>
    </Container>
  );
};
