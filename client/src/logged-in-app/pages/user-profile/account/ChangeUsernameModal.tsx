import { useForm } from 'react-hook-form'
import { Modal } from '../../../../shared/components/layout/Modal'
import { H2 } from '../../../../shared/components/Titles'
import { Input } from '../../../../elements/Input'
import { Buttons } from '../../../../shared/components/layout/Buttons'
import { Button, PrimaryButton } from '../../../../shared/components/Button'
import httpClient from '../../../../http-client'
import { IUser } from '../../../../shared/models/IUser'
import { z } from 'zod'
import { useQueryClient } from 'react-query'
import { useAlert } from '../../../../shared/contexts/AlertContext'
import { usernameValidator } from '../../../../pages/auth/sign-up'

const changeUserUsernameSchema = z.object({
  username: usernameValidator,
})

type ChangeUserUsernameFormData = z.infer<typeof changeUserUsernameSchema>

type ChangeUsernameModalProps = {
  id: number
  closeModal: () => void
}

const ChangeUsernameModal = ({ id, closeModal }: ChangeUsernameModalProps) => {
  const queryClient = useQueryClient()
  const { pushSuccess, pushDanger } = useAlert()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeUserUsernameFormData>()

  const onSubmit = handleSubmit((data) => {
    return httpClient.patch<IUser>(`/users${id}`, data).then((res) => {
      if (res.status !== 200) {
        pushDanger('Cannot change email')
        return
      }

      pushSuccess('Email updated')
      queryClient.invalidateQueries(['user'])

      closeModal()
    })
  })

  return (
    <Modal close={closeModal}>
      <header>
        <H2>Change your username</H2>
      </header>

      <form onSubmit={onSubmit}>
        <Input
          label="New username"
          type="text"
          error={errors.username?.message}
          {...register('username')}
        />

        <Buttons>
          <PrimaryButton>Change username</PrimaryButton>
          <Button type="button" onClick={() => closeModal()}>
            Cancel
          </Button>
        </Buttons>
      </form>
    </Modal>
  )
}

export { ChangeUsernameModal }
