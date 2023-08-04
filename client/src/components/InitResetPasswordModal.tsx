import { useForm } from 'react-hook-form'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useAPI } from '../shared/hooks/useAPI'
import { APIRoutes } from '../shared/enums/APIRoutes'
import { useAlert } from '../shared/contexts/AlertContext'
import { Modal } from '../shared/components/layout/Modal'
import { Input } from '../elements/Input'
import { Buttons } from '../shared/components/layout/Buttons'
import { H2 } from '../shared/components/Titles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../elements/button/Button'

const resetPasswordSchema = z.object({
  email: z.string({ required_error: 'Email required' }).email(),
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

type InitResetPasswordModalProps = {
  closeModal: () => void
}

const InitResetPasswordModal = ({ closeModal }: InitResetPasswordModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const { put } = useAPI()
  const { pushSuccess, pushDanger } = useAlert()

  const onSubmit = handleSubmit((data) => {
    put(APIRoutes.INIT_RESET_PASSWORD, data).then((res) => {
      if (res.status === 202) {
        pushSuccess('Reset password initiate, check your email')
        closeModal()
      } else if (res.status === 404) {
        pushDanger("Email doesn't exist")
      } else {
        pushDanger('Cannot reset password')
      }
    })
  })

  return (
    <Modal close={closeModal}>
      <header>
        <H2>Reset your password</H2>
      </header>
      <form onSubmit={onSubmit}>
        <section>
          <Input
            icon={faEnvelope}
            label="Email"
            type="email"
            placeholder="Enter a valid email"
            error={errors.email?.message}
            {...register('email')}
          />
        </section>
        <footer>
          <Buttons>
            <Button type="submit">Reset password</Button>
            <Button onClick={() => closeModal()}>Cancel</Button>
          </Buttons>
        </footer>
      </form>
    </Modal>
  )
}

export { InitResetPasswordModal }
