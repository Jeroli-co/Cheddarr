import { useForm } from 'react-hook-form'
import { Modal } from '../../../../shared/components/layout/Modal'
import { H2 } from '../../../../shared/components/Titles'
import { Input } from '../../../../elements/Input'
import { Buttons } from '../../../../shared/components/layout/Buttons'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import httpClient from '../../../../http-client'
import { IUser } from '../../../../shared/models/IUser'
import { useAlert } from '../../../../shared/contexts/AlertContext'
import { useQueryClient } from 'react-query'
import { Button } from '../../../../elements/button/Button'

const changeUserEmailSchema = z.object({
  email: z.string({ required_error: 'Sender address is required' }).email().trim(),
})

type ChangeUserEmailFormData = z.infer<typeof changeUserEmailSchema>

type ChangeEmailModalProps = {
  closeModal: () => void
  id: number
}

export const ChangeEmailModal = ({ closeModal, id }: ChangeEmailModalProps) => {
  const queryClient = useQueryClient()
  const { pushSuccess, pushDanger } = useAlert()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeUserEmailFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(changeUserEmailSchema),
    defaultValues: {
      email: '',
    },
  })

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
        <H2>Change your email</H2>
      </header>

      <form onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="Enter a valid email"
          error={errors.email?.message}
          {...register('email')}
        />

        <footer>
          <Buttons>
            <Button type="submit">Change email</Button>
            <Button type="button" onClick={() => closeModal()}>
              Cancel
            </Button>
          </Buttons>
        </footer>
      </form>
    </Modal>
  )
}
