import React from "react";
import styled from "styled-components";
import { SwitchErrors } from "../../../shared/components/errors/SwitchErrors";
import { Spinner } from "../../../shared/components/Spinner";
import { UpdateProfile } from "./account/UpdateProfile";
import { H1, H2 } from "../../../shared/components/Titles";
import { STATIC_STYLES } from "../../../shared/enums/StaticStyles";
import { PrimaryDivider } from "../../../shared/components/Divider";
import { useParams } from "react-router";
import { useUser } from "../../../shared/hooks/useUser";
import { Roles } from "../../../shared/enums/Roles";
import { useUserService } from "../../../shared/toRefactor/useUserService";
import { RolesTree } from "../../../shared/components/RolesTree";
import { checkRole } from "../../../utils/roles";
import { useSession } from "../../../shared/contexts/SessionContext";

const SubContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  flex-wrap: wrap;
`;

const InfosContainer = styled.div`
  text-align: center;

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

const UserPictureStyle = styled.img`
  width: 75%;
  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 50%;
  }
`;

type RouteParams = {
  id?: string;
};

const Profile = () => {
  const { id } = useParams<RouteParams>();

  const { currentUser: profileOwner, updateUser } = useUser(id);
  const { updateUserById } = useUserService();
  const {
    session: { user },
  } = useSession();

  const onRoleChange = (role: Roles) => {
    if (profileOwner.data && profileOwner.data.id) {
      updateUserById(
        profileOwner.data.id,
        { roles: role },
        "Cannot update roles",
        "Roles updated"
      ).then((res) => {
        if (res.status === 200 && res.data) {
          updateUser(res.data);
        }
      });
    }
  };

  if (profileOwner.isLoading) return <Spinner />;

  if (profileOwner.data === null)
    return <SwitchErrors status={profileOwner.status} />;

  return (
    <>
      <H1>Account</H1>
      <PrimaryDivider />
      <div>
        <SubContainer>
          <InfosContainer>
            <UserPictureStyle src={profileOwner.data.avatar} alt="User" />
            <p className="username">
              <i>{"@" + profileOwner.data.username}</i>
            </p>
            {user &&
              profileOwner.data &&
              profileOwner.data.roles &&
              checkRole(
                user.roles,
                [Roles.ADMIN, Roles.MANAGE_USERS],
                true
              ) && <p>{profileOwner.data.email}</p>}
          </InfosContainer>
          <div>
            {user &&
              profileOwner.data &&
              profileOwner.data.roles &&
              checkRole(
                user.roles,
                [Roles.ADMIN, Roles.MANAGE_USERS],
                true
              ) && (
                <>
                  <H2>User roles</H2>
                  <RolesTree
                    defaultValue={profileOwner.data.roles}
                    onSave={onRoleChange}
                  />
                </>
              )}
          </div>
        </SubContainer>
        <PrimaryDivider />
        {user &&
          checkRole(user.roles, [Roles.ADMIN, Roles.MANAGE_USERS], true) && (
            <UpdateProfile id={profileOwner.data.id} />
          )}
      </div>
    </>
  );
};

export { Profile };
