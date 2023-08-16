import { z } from 'zod'

// # Notifications services
export enum NotificationsServiceEnum {
  EMAIL = 'email',
}

export const postNotificationsServiceSettingsSchema = z.object({
  enabled: z.boolean(),
  settings: z.object({
    smtpPort: z
      .number()
      .int()
      .min(1, { message: 'SMTP port is required' })
      .max(65535, { message: 'SMTP port must be less than 65535' }),
    smtpHost: z.string().min(1, { message: 'SMTP host is required' }).trim(),
    smtpUser: z.string().min(1, { message: 'SMTP user is required' }).trim(),
    smtpPassword: z.string().min(1, { message: 'SMTP password is required' }).trim(),
    senderAddress: z.string().min(1, { message: 'Sender address is required' }).trim(),
    senderName: z.string().min(1, { message: 'Sender name is required' }).trim(),
    ssl: z.boolean(),
  }),
})

export type PostNotificationsServiceSettings = z.infer<typeof postNotificationsServiceSettingsSchema>
export type NotificationsServiceSettings = PostNotificationsServiceSettings

// ## Email
export type PostEmailSettings = PostNotificationsServiceSettings
export type EmailSettings = PostEmailSettings
