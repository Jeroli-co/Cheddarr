import React, { useState } from "react";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import {
  DangerIconButton,
  PrimaryIconButton,
} from "../../../../shared/components/Button";
import { Icon } from "../../../../shared/components/Icon";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
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
import { useHistory } from "react-router-dom";
import { routes } from "../../../../router/routes";

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

export const UsersConfirmed = () => {
  const { deleteUser } = useUserService();
  const {
    session: { user },
  } = useSession();
  const history = useHistory();

  const [deleteUserModalState, setDeleteUserModalState] = useState<{
    isOpen: boolean;
    user: IUser | null;
  }>({ isOpen: false, user: null });

  const { data, loadPrev, loadNext, deleteData } = usePagination<IUser>(
    APIRoutes.GET_USERS(true),
    true
  );

  const onUserEditClick = (clickedUser: IUser) => {
    history.push(routes.PROFILE.url(clickedUser.id.toString(10)));
    // setEditUserModalState({ isOpen: true, user: user });
  };

  const onDeleteUserClick = (clickedUser: IUser) => {
    setDeleteUserModalState({ isOpen: true, user: clickedUser });
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
      <Header>
        <p>Username</p>
      </Header>
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
      </Container>
      {data.data && data.data.results && data.data.results.length > 1 && (
        <PaginationArrows
          currentPage={data.data?.page}
          totalPages={data.data?.totalPages}
          onLoadPrev={() => loadPrev()}
          onLoadNext={() => loadNext()}
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
