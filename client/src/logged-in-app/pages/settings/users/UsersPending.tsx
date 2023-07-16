import React, { useState } from "react";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { IUser } from "../../../../shared/models/IUser";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { Spinner } from "../../../../shared/components/Spinner";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import {
  DangerIconButton,
  SuccessIconButton,
} from "../../../../shared/components/Button";
import { Icon } from "../../../../shared/components/Icon";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { DeleteDataModal } from "../../../../shared/components/DeleteDataModal";
import { useUserService } from "../../../../shared/toRefactor/useUserService";
import { PaginationArrows } from "../../../../shared/components/PaginationArrows";
import { UserSmallCard } from "../../../../shared/components/UserSmallCard";

const Header = styled.div`
  background: ${(props) => props.theme.primaryLight};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 30px;
  font-size: 20px;
`;

const Container = styled.div`
  background: ${(props) => props.theme.primary};
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
`;

export const UsersPending = () => {
  const { updateUserById, deleteUser } = useUserService();

  const { data, loadPrev, loadNext, deleteData } = usePagination<IUser>(
    APIRoutes.USERS(false),
    true
  );

  const [deleteUserModalState, setDeleteUserModalState] = useState<{
    isOpen: boolean;
    user: IUser | null;
  }>({ isOpen: false, user: null });

  const onConfirmUser = (id: number) => {
    updateUserById(id, { confirmed: true }).then((res) => {
      if (res.status === 200 && res.data) {
        deleteData((u) => u.id === id);
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

  if (data.data && data.data.results.length === 0) {
    return <p>No user is waiting for confirmation</p>;
  }

  return (
    <>
      <Header>
        <p>Username</p>
      </Header>
      <Container>
        {data.data &&
          data.data.results &&
          data.data.results.map((u) => (
            <div key={u.username}>
              <Item>
                <UserSmallCard user={u} />
                <Buttons>
                  <SuccessIconButton onClick={() => onConfirmUser(u.id)}>
                    <Icon icon={faCheck} />
                  </SuccessIconButton>
                  <DangerIconButton onClick={() => onDeleteUserClick(u)}>
                    <Icon icon={faTimes} />
                  </DangerIconButton>
                </Buttons>
              </Item>
            </div>
          ))}
      </Container>
      <PaginationArrows
        currentPage={data.data?.page}
        totalPages={data.data?.pages}
        onLoadPrev={() => loadPrev()}
        onLoadNext={() => loadNext()}
      />
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
          description={`This operation will delete all informations about the user ${deleteUserModalState.user.username} from this Cheddarr instance.`}
        />
      )}
    </>
  );
};
