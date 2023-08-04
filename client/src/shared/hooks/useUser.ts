import { IUser } from '../models/IUser'
import { useSession } from '../contexts/SessionContext'
import { checkRole } from '../../utils/roles'
import { Roles } from '../enums/Roles'
import { useData } from '../../hooks/useData'
import { useQueryClient } from 'react-query'

export const useUser = (id?: string) => {
  const queryClient = useQueryClient()
  const {
    session: { user },
  } = useSession()

  if (!user) throw new Error('User not set')

  if (
    user.id.toString() !== id &&
    !checkRole(user.roles, [Roles.MANAGE_USERS, Roles.ADMIN], true)
  ) {
    throw new Error('You are not allowed to view this page')
  }

  const { data, isLoading, isFetching } = useData<IUser>(
    ['users', id ?? user.id.toString()],
    `/users/${id ?? user.id}`
  )

  const updateUser = (user: IUser) => {
    queryClient.invalidateQueries(['users', id ?? user.id.toString()])
  }

  return { currentUser: data, updateUser, isLoading: isLoading || isFetching }
}
