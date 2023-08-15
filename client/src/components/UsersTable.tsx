import { useMemo, useState } from 'react'
import { SuccessTag } from '../shared/components/Tag'
import { Button } from '../elements/button/Button'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../shared/components/Icon'
import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Table, TableColumns, createTableColumns } from '../elements/Table'
import { UserSmallCard } from '../shared/components/UserSmallCard'
import { Buttons } from '../shared/components/layout/Buttons'
import { PaginationHookProps } from '../hooks/usePagination'
import { Title } from '../elements/Title'
import { type ColumnDef } from '@tanstack/react-table'
import { Spinner } from '../shared/components/Spinner'
import { IUser } from '../shared/models/IUser'
import { DeleteDataModal } from './DeleteUserModal'

const Head = ({ confirmed }: { confirmed: boolean }) => {
  return (
    <>
      <Title as="h1">Users {confirmed ? 'confirmed' : 'pending'}</Title>
      <p className="mb-8">
        {confirmed ? 'Manage the confirmed users on this server.' : 'See user waiting for confirmation on this server.'}
      </p>
    </>
  )
}

const columnHelper = createTableColumns<IUser>()

export const UsersTable = ({
  isLoading,
  isFetching,
  data,
  confirmed,
  ...props
}: PaginationHookProps<IUser> & {
  confirmed: boolean
}) => {
  const navigate = useNavigate()

  const [deleteUserModalState, setDeleteUserModalState] = useState<{
    isOpen: boolean
    user: IUser | null
  }>({ isOpen: false, user: null })

  const columns = useMemo<TableColumns<IUser>>(
    () =>
      [
        columnHelper.accessor((row) => row, {
          id: 'avatar',
          cell: (info) => <UserSmallCard user={info.getValue()} />,
          header: 'Avatar',
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.email, {
          id: 'email',
          cell: (info) => info.getValue(),
          header: 'Email',
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.roles, {
          id: 'roles',
          cell: (info) => {
            const roles = info.getValue()
            return roles && <SuccessTag>{roles}</SuccessTag>
          },
          header: 'Roles',
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row, {
          id: 'actions',
          cell: (info) => {
            const user = info.getValue()
            return (
              <Buttons className="justify-center">
                {confirmed ? (
                  // Cant work because user.id is undefined
                  <Button mode="square" onClick={() => navigate(`/profile/${user.id}`)}>
                    <Icon icon={faEdit} />
                  </Button>
                ) : (
                  // Cant work because user.id is undefined
                  <Button mode="square" color="success" onClick={() => navigate(`/profile/${user.id}`)}>
                    <Icon icon={faCheck} />
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="danger"
                  mode="square"
                  onClick={() => setDeleteUserModalState({ isOpen: true, user })}
                >
                  <Icon icon={faTimes} />
                </Button>
              </Buttons>
            )
          },
          header: 'Actions',
          footer: (info) => info.column.id,
        }),
      ].filter((c) => !!c) as ColumnDef<IUser>[],
    [],
  )

  return (
    <>
      <div className="text-xl text-danger">Cant 't work because user.id is null</div>

      <Head confirmed={confirmed} />

      {(isLoading || isFetching) && <Spinner size="lg" />}

      {!(isLoading || isFetching) && (data?.results.length ?? 0) > 0 && (
        <Table columns={columns} data={data} isLoading={isLoading} isFetching={isFetching} {...props} />
      )}

      {!(isLoading || isFetching) && (data?.results.length ?? 0) === 0 && (
        <p className="font-bold">No users to display</p>
      )}

      <DeleteDataModal
        user={deleteUserModalState.user ?? undefined}
        isOpen={deleteUserModalState.isOpen}
        onClose={() => setDeleteUserModalState({ isOpen: false, user: null })}
      />
    </>
  )
}
