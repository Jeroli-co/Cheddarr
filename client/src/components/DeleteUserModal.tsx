import { faClose } from '@fortawesome/free-solid-svg-icons'
import { Modal } from '../elements/modal/Modal'
import { Button } from '../elements/button/Button'
import { Icon } from '../shared/components/Icon'
import { Buttons } from '../shared/components/layout/Buttons'
import httpClient from '../utils/http-client'
import { useAlert } from '../shared/contexts/AlertContext'
import { useQueryClient } from 'react-query'
import { IUser } from '../shared/models/IUser'

type DeleteDataModalProps = {
  isOpen: boolean
  onClose: () => void
  user?: IUser
}

export const DeleteDataModal: React.FC<DeleteDataModalProps> = ({ isOpen, onClose, user }) => {
  const queryClient = useQueryClient()
  const { pushSuccess, pushDanger } = useAlert()

  // Cant work because user.id is empty

  const deleteUser = (id?: number) => {
    if (!id) return

    return httpClient.delete(`/users/${id}`).then((res) => {
      if (res.status !== 204) {
        pushDanger('Error deleting user')
        return
      }

      pushSuccess('User deleted')
      queryClient.invalidateQueries(['users'])
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Are you sure ?`}
      Footer={
        <Button color="danger" onClick={() => deleteUser(user?.id)}>
          <Icon icon={faClose} />
          <span> Delete for ever</span>
        </Button>
      }
      hasCloseFooterButton={true}
    >
      This operation will delete the user <b>{user?.username}</b> from this Cheddarr instance.
      <br />
      <br />
      <b>All information related to the user will be lost !</b>
    </Modal>
  )
}
