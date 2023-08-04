import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { useNavigate } from 'react-router'
import styled from 'styled-components'
import { usePagination } from '../hooks/usePagination'
import httpClient from '../http-client'
import { routes } from '../routes'
import { DeleteDataModal } from '../shared/components/DeleteDataModal'
import { Icon } from '../shared/components/Icon'
import { PaginationArrows } from '../shared/components/PaginationArrows'
import { Spinner } from '../shared/components/Spinner'
import { UserSmallCard } from '../shared/components/UserSmallCard'
import { Buttons } from '../shared/components/layout/Buttons'
import { useAlert } from '../shared/contexts/AlertContext'
import { useSession } from '../shared/contexts/SessionContext'
import { IUser } from '../shared/models/IUser'
import { Button } from '../elements/button/Button'

const Header = styled.div`
  background: ${(props) => props.theme.primaryLight};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 30px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > p {
    flex: 1 1 0;
    display: flex;
    align-items: center;

    &:not(:first-child) {
      justify-content: center;
    }

    &:last-child {
      justify-content: flex-end;
    }
  }
`

const Container = styled.div`
  background: ${(props) => props.theme.primary};
`

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;

  > span {
    flex: 1 1 0;
    display: flex;
    align-items: center;

    &:not(:first-child) {
      justify-content: center;
    }

    &:last-child {
      justify-content: flex-end;
    }
  }
`

// eslint-disable-next-line import/no-anonymous-default-export
export const UsersList = ({ confirmed }: { confirmed?: boolean }) => {
  const queryClient = useQueryClient()
  const { pushSuccess, pushDanger } = useAlert()

  const {
    session: { user },
  } = useSession()
  const navigate = useNavigate()

  const { data, isLoading, isFetching, loadPrev, loadNext } = usePagination<IUser>(
    ['users', confirmed ? 'confirmed' : 'pending'],
    `/users`,
    confirmed ? { confirmed: 'true' } : undefined
  )

  const [deleteUserModalState, setDeleteUserModalState] = useState<{
    isOpen: boolean
    user: IUser | null
  }>({ isOpen: false, user: null })

  const onUserEditClick = (clickedUser: IUser) => {
    navigate(routes.PROFILE.url(clickedUser.id.toString(10)))
    // setEditUserModalState({ isOpen: true, user: user });
  }

  const onDeleteUserClick = (clickedUser: IUser) => {
    setDeleteUserModalState({ isOpen: true, user: clickedUser })
  }

  const deleteUser = (id: number) => {
    return httpClient.delete(`/users${id}`).then((res) => {
      if (res.status !== 204) {
        pushDanger('Error deleting user')
        return
      }

      pushSuccess('User deleted')
      queryClient.invalidateQueries(['users'])
    })
  }

  if (isLoading || isFetching) return <Spinner />

  return (
    <>
      <Header>
        <p>Username</p>
        <p />
      </Header>
      <Container>
        {user &&
          data?.results?.map((u) => (
            <div key={u.username}>
              <Item>
                <UserSmallCard user={u} />
                <span>
                  <Buttons>
                    {confirmed ? (
                      <Button mode="square" onClick={() => onUserEditClick(u)}>
                        <Icon icon={faEdit} />
                      </Button>
                    ) : (
                      <Button mode="square" color="success" onClick={() => onUserEditClick(u)}>
                        <Icon icon={faCheck} />
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="danger"
                      mode="square"
                      onClick={() => onDeleteUserClick(u)}
                    >
                      <Icon icon={faTimes} />
                    </Button>
                  </Buttons>
                </span>
              </Item>
            </div>
          ))}
      </Container>

      {(data?.results?.length ?? 0) > 1 && (
        <PaginationArrows
          currentPage={data?.page}
          totalPages={data?.pages}
          onLoadPrev={() => loadPrev()}
          onLoadNext={() => loadNext()}
        />
      )}

      {deleteUserModalState.isOpen && deleteUserModalState.user && (
        <DeleteDataModal
          closeModal={() => setDeleteUserModalState({ isOpen: false, user: null })}
          actionLabel={'Confirm'}
          action={() => deleteUser(deleteUserModalState?.user?.id ?? -1)}
          title={`Are you sure you want to delete ${deleteUserModalState.user.username}`}
          description={`This operation will delete all information about the user ${deleteUserModalState.user.username} from this Cheddarr instance.`}
        />
      )}
    </>
  )
}
