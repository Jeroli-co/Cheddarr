import { faKey } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { FORM_DEFAULT_VALIDATOR } from '../shared/enums/FormDefaultValidators'
import { useAlert } from '../shared/contexts/AlertContext'
import { Input } from '../elements/Input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../elements/button/Button'
import httpClient from '../http-client'

export const resetPasswordSchema = z
  .object({
    oldPassword: z.string({ required_error: 'Old password required' }).trim(),
    newPassword: z
      .string({ required_error: 'New password required' })
      .trim()
      .regex(FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value, {
        message: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message,
      }),
    newPasswordConfirmation: z.string({ required_error: 'Confirmation required' }).trim(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords don't match",
    path: ['newPasswordConfirmation'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

type ResetPasswordFormProps = {
  token: string
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
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

  const onSubmit = handleSubmit((data) => {
    httpClient.post(`/user/password/${token}`, data).then((res) => {
      if (res.status !== 204) {
        pushDanger('Cannot reset password')
        return
      }

      pushSuccess('Password has been reset')
    })
  })

  return (
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
  )
}

export { ResetPasswordForm }
