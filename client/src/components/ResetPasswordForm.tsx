import React from 'react'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { FORM_DEFAULT_VALIDATOR } from '../shared/enums/FormDefaultValidators'
import { useAPI } from '../shared/hooks/useAPI'
import { APIRoutes } from '../shared/enums/APIRoutes'
import { useAlert } from '../shared/contexts/AlertContext'
import { Input } from '../elements/Input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../elements/button/Button'

const resetPasswordSchema = z
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

type ResetPasswordFormProps = {
  token: string
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
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
  const { post } = useAPI()
  const { pushSuccess, pushDanger } = useAlert()

  const onSubmit = handleSubmit((data) => {
    post(APIRoutes.RESET_PASSWORD(token), data).then((res) => {
      if (res.status === 204) {
        pushSuccess('Password has been reset')
      } else {
        pushDanger('Cannot reset password')
      }
    })
  })

  return (
    <div>
      <div className="columns is-mobile is-centered">
        <div className="column is-one-third">
          <form id="reset-password-form" className="PasswordForm" onSubmit={onSubmit}>
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
        </div>
      </div>
    </div>
  )
}

export { ResetPasswordForm }
