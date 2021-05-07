import React, { useState } from "react";
import styled from "styled-components";
import { Spinner } from "../../../../shared/components/Spinner";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { IPublicUser } from "../../../../shared/models/IPublicUser";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import {
  DangerIconButton,
  PrimaryIconButton,
} from "../../../../shared/components/Button";
import { Icon } from "../../../../shared/components/Icon";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { H1 } from "../../../../shared/components/Titles";
import { UserSettingsModal } from "./UserSettingsModal";

const Container = styled.div`
  background: ${(props) => props.theme.primary};
  border-radius: 24px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
`;

export const UsersSettings = () => {
  const [editUserModalState, setEditUserModalState] = useState<{
    isOpen: boolean;
    publicUser: IPublicUser | null;
  }>({
    isOpen: false,
    publicUser: null,
  });
  const {
    data,
    loadPrev,
    loadNext,
    updateData,
    deleteData,
    sortData,
  } = usePagination<IPublicUser>(APIRoutes.GET_USERS, true);

  const onUserEditClick = (user: IPublicUser) => {
    setEditUserModalState({ isOpen: true, publicUser: user });
  };

  if (data.isLoading) return <Spinner />;

  return (
    <>
      <H1>Manage users</H1>
      <br />
      <Container>
        {data.data &&
          data.data.results &&
          data.data.results.map((u) => (
            <div key={u.username}>
              <Item>
                {u.username}
                <Buttons>
                  <PrimaryIconButton onClick={() => onUserEditClick(u)}>
                    <Icon icon={faEdit} />
                  </PrimaryIconButton>
                  <DangerIconButton>
                    <Icon icon={faTimes} />
                  </DangerIconButton>
                </Buttons>
              </Item>
            </div>
          ))}
      </Container>
      {editUserModalState.isOpen && editUserModalState.publicUser && (
        <UserSettingsModal
          closeModal={() =>
            setEditUserModalState({ isOpen: false, publicUser: null })
          }
          publicUser={editUserModalState.publicUser}
        />
      )}
    </>
  );
};
