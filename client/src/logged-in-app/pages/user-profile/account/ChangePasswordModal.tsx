import { faKey } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { Button } from '../../../../shared/components/Button'
import { Modal } from '../../../../shared/components/layout/Modal'
import { H2 } from '../../../../shared/components/Titles'
import { Input } from '../../../../elements/Input'
import { useAlert } from '../../../../shared/contexts/AlertContext'
import { useQueryClient } from 'react-query'
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from '../../../../components/ResetPasswordForm'
import { zodResolver } from '@hookform/resolvers/zod'
import httpClient from '../../../../http-client'
import { IUser } from '../../../../shared/models/IUser'

type ChangePasswordModalProps = {
  id: number
  closeModal: () => void
}

const ChangePasswordModal = ({ id, closeModal }: ChangePasswordModalProps) => {
  const queryClient = useQueryClient()
  const { pushSuccess, pushDanger } = useAlert()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    },
  })

  const onSubmit = handleSubmit((data: ResetPasswordFormData) => {
    return httpClient.patch<IUser>(`/users${id}`, data).then((res) => {
      if (res.status !== 200) {
        pushDanger('Cannot change password')
        return
      }

      pushSuccess('Password updated')
      queryClient.invalidateQueries(['user'])

      closeModal()
    })
  })

  return (
    <Modal close={closeModal}>
      <header>
        <H2>Change your password</H2>
      </header>

      <form onSubmit={onSubmit}>
        {/* NEW PASSWORD */}
        <Input
          icon={faKey}
          label="Old password"
          type="password"
          placeholder="Enter your current password"
          error={errors.oldPassword?.message}
          {...register('oldPassword')}
        />

        <Input
          icon={faKey}
          label="New password"
          type="password"
          placeholder="Enter your new password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <Input
          icon={faKey}
          label="Password confirmation"
          type="password"
          placeholder="Confirm your new password"
          error={errors.newPasswordConfirmation?.message}
          {...register('newPasswordConfirmation')}
        />

        <Button type="submit">Reset password</Button>
      </form>
    </Modal>
  )
}

export { ChangePasswordModal }
