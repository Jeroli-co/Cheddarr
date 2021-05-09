import React, { useState } from "react";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import {
  DangerIconButton,
  PrimaryIconButton,
} from "../../../../shared/components/Button";
import { Icon } from "../../../../shared/components/Icon";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { UserSettingsModal } from "./UserSettingsModal";
import { IUser } from "../../../../shared/models/IUser";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { Roles } from "../../../../shared/enums/Roles";
import { Spinner } from "../../../../shared/components/Spinner";
import styled from "styled-components";
import { useUserService } from "../../../../shared/toRefactor/useUserService";
import { PaginationArrows } from "../../../../shared/components/PaginationArrows";
import { DeleteDataModal } from "../../../../shared/components/DeleteDataModal";
import { useSession } from "../../../../shared/contexts/SessionContext";

const Container = styled.div`
  background: ${(props) => props.theme.primary};
  border-radius: 24px;

  .footer {
    display: flex;
    justify-content: flex-end;
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
`;

export const UsersConfirmed = () => {
  const { updateUserById, deleteUser } = useUserService();
  const {
    session: { user },
  } = useSession();

  const [editUserModalState, setEditUserModalState] = useState<{
    isOpen: boolean;
    user: IUser | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [deleteUserModalState, setDeleteUserModalState] = useState<{
    isOpen: boolean;
    user: IUser | null;
  }>({ isOpen: false, user: null });

  const { data, loadPrev, loadNext, updateData, deleteData } = usePagination<
    IUser
  >(APIRoutes.GET_USERS(true), true);

  const onUserEditClick = (user: IUser) => {
    setEditUserModalState({ isOpen: true, user: user });
  };

  const onRoleChange = (id: number, role: Roles) => {
    updateUserById(
      id,
      { roles: role },
      "Cannot update roles",
      "Roles updated"
    ).then((res) => {
      if (res.status === 200 && res.data) {
        const newRoles = res.data.roles;
        updateData(
          (u) => u.id === id,
          (u) => (u.roles = newRoles)
        );
      }
    });
  };

  const onDeleteUserClick = (user: IUser) => {
    setDeleteUserModalState({ isOpen: true, user: user });
  };

  const onDeleteUser = (id: number) => {
    deleteUser(id).then((res) => {
      if (res.status === 200) {
        deleteData((u) => u.id === id);
        setDeleteUserModalState({ isOpen: false, user: null });
      }
    });
  };

  if (data.isLoading) return <Spinner />;

  if (data.data && data.data.results.length <= 1) {
    return <p>No user to confirm yet</p>;
  }

  return (
    <>
      <Container>
        {user &&
          data.data &&
          data.data.results &&
          data.data.results.map(
            (u) =>
              u.id !== user.id && (
                <div key={u.username}>
                  <Item>
                    {u.username}
                    <Buttons>
                      <PrimaryIconButton onClick={() => onUserEditClick(u)}>
                        <Icon icon={faEdit} />
                      </PrimaryIconButton>
                      <DangerIconButton onClick={() => onDeleteUserClick(u)}>
                        <Icon icon={faTimes} />
                      </DangerIconButton>
                    </Buttons>
                  </Item>
                </div>
              )
          )}
        {data.data && data.data.results && data.data.results.length > 1 && (
          <PaginationArrows
            currentPage={data.data?.page}
            totalPages={data.data?.totalPages}
            onLoadPrev={() => loadPrev()}
            onLoadNext={() => loadNext()}
          />
        )}
      </Container>
      {editUserModalState.isOpen && editUserModalState.user && (
        <UserSettingsModal
          closeModal={() =>
            setEditUserModalState({ isOpen: false, user: null })
          }
          onRoleChange={onRoleChange}
          publicUser={editUserModalState.user}
        />
      )}
      {deleteUserModalState.isOpen && deleteUserModalState.user && (
        <DeleteDataModal
          closeModal={() =>
            setDeleteUserModalState({ isOpen: false, user: null })
          }
          actionLabel={"Confirm"}
          action={() =>
            onDeleteUser(
              deleteUserModalState.user ? deleteUserModalState.user.id : -1
            )
          }
          title={`Are you sure you want to delete ${deleteUserModalState.user.username}`}
          description={`This operation will delete all information about the user ${deleteUserModalState.user.username} from this Cheddarr instance.`}
        />
      )}
    </>
  );
};
