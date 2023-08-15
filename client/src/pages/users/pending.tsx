import { UsersTable } from '../../components/UsersTable'
import { usePagination } from '../../hooks/usePagination'
import { IUser } from '../../shared/models/IUser'

export default () => {
  const pagination = usePagination<IUser>(
    ['users', 'pending'],
    `/users`,
    new URLSearchParams({ confirmed: 'false' }).toString(),
  )

  return <UsersTable confirmed={false} {...pagination} />
}
