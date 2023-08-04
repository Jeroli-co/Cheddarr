import { useForm } from 'react-hook-form'
import { Input } from '../../../../../elements/Input'
import { Checkbox } from '../../../../../elements/checkbox/Checkbox'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import httpClient from '../../../../../http-client'
import { useAlert } from '../../../../../shared/contexts/AlertContext'
import { useQueryClient } from 'react-query'
import { Button } from '../../../../../elements/button/Button'

const postEmailSettingsSchema = z.object({
  enabled: z.boolean(),
  smtpHost: z.string({ required_error: 'SMTP host is required' }).trim(),
  smtpPort: z.number().int().min(1).max(65535),
  smtpUser: z.string({ required_error: 'SMTP user is required' }).trim(),
  smtpPassword: z.string({ required_error: 'SMTP password is required' }).trim(),
  senderAddress: z.string({ required_error: 'Sender address is required' }).email().trim(),
  senderName: z.string({ required_error: 'Sender name is required' }).trim(),
  ssl: z.boolean(),
})

type PostEmailSettingsFormData = z.infer<typeof postEmailSettingsSchema>

export type EmailSettings = PostEmailSettingsFormData & {
  id: string
}

type EmailSettingsFormProps = {
  defaultSettings?: EmailSettings
}

export const EmailSettingsForm = ({ defaultSettings }: EmailSettingsFormProps) => {
  const queryClient = useQueryClient()
  const { pushSuccess, pushDanger } = useAlert()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PostEmailSettingsFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(postEmailSettingsSchema),
    defaultValues: { ...defaultSettings },
  })

  const deleteSettings = () => {
    if (!defaultSettings) return

    httpClient.delete(`/notifications/agents/email/${defaultSettings?.id}`).then((res) => {
      if (res.status !== 200) {
        pushDanger('Cannot delete configuration')
        return
      }

      pushSuccess('Configuration deleted')
      queryClient.invalidateQueries(['notifications/agents', 'email'])
    })
  }

  const onSubmit = handleSubmit((data) => {
    const settings = {
      enabled: data.enabled,
      settings: { ...data },
    }
    return httpClient
      .put<{ enabled: boolean; settings: PostEmailSettingsFormData }>(
        '/notifications/agents/email',
        settings
      )
      .then((res) => {
        if (res.status !== 200) {
          pushDanger('Failed to save SMTP Server config')
          return
        }

        pushSuccess('SMTP Server config saved')
        queryClient.invalidateQueries(['notifications/agents', 'email'])
      })
  })

  return (
    <form onSubmit={onSubmit}>
      <Checkbox label="Enabled" {...register('enabled')} />
      <Input
        label="Hostname"
        type="text"
        error={errors.smtpHost?.message}
        {...register('smtpHost')}
      />
      <Input
        label="Port"
        type="number"
        error={errors.smtpPort?.message}
        {...register('smtpPort')}
      />
      <Input
        label="Username"
        type="text"
        error={errors.smtpUser?.message}
        {...register('smtpUser')}
      />
      <Input
        label="Password"
        type="password"
        error={errors.smtpPassword?.message}
        {...register('smtpPassword')}
      />
      <Input
        label="Sender address"
        type="email"
        error={errors.senderAddress?.message}
        {...register('senderAddress')}
      />
      <Input
        label="Sender name"
        type="text"
        error={errors.senderName?.message}
        {...register('senderName')}
      />
      <Checkbox label="SSL" {...register('ssl')} />
      {defaultSettings && (
        <Button type="button" onClick={() => deleteSettings()}>
          Delete
        </Button>
      )}
      <Button type="submit">Save</Button>{' '}
    </form>
  )
}
