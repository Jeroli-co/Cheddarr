import { UsersTable } from '../../components/UsersTable'
import { usePagination } from '../../hooks/usePagination'
import { IUser } from '../../shared/models/IUser'

export default () => {
  const pagination = usePagination<IUser>(
    ['users', 'confirmed'],
    `/users`,
    new URLSearchParams({ confirmed: 'true' }).toString(),
  )

  return <UsersTable confirmed {...pagination} />
}
