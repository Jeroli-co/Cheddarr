import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  NotificationsServiceEnum,
  NotificationsServiceSettings,
  postNotificationsServiceSettingsSchema,
} from '../schemas/notifications-services'
import { Modal, ModalProps } from '../elements/modal/Modal'
import { useAlert } from '../shared/contexts/AlertContext'
import httpClient from '../utils/http-client'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../elements/button/Button'
import { SettingsPreviewCard } from './ConfigPreviewCard'
import { Spinner } from '../shared/components/Spinner'
import { EmailSettingsForm } from './EmailSettingsForm'

const getModalTitle = (notificationsServiceType?: NotificationsServiceEnum) => {
  switch (notificationsServiceType) {
    case NotificationsServiceEnum.EMAIL:
      return 'Add email smtp server'
    default:
      return 'Choose a notifications service'
  }
}

type PickNotificationsServiceTypeModalProps = ModalProps

export const PickNotificationsServiceTypeModal: React.FC<PickNotificationsServiceTypeModalProps> = ({
  isOpen,
  onClose,
  ...props
}) => {
  const queryClient = useQueryClient()
  const { pushDanger, pushSuccess } = useAlert()

  const [type, setType] = useState<NotificationsServiceEnum>()

  const resolverSchema = useMemo(() => {
    switch (type) {
      case NotificationsServiceEnum.EMAIL:
        return postNotificationsServiceSettingsSchema
      default:
        return z.object({})
    }
  }, [type])

  type FormDataType = z.infer<typeof resolverSchema>

  const { handleSubmit, formState, reset, getValues, ...form } = useForm<FormDataType>({
    mode: 'onBlur',
    resolver: zodResolver(resolverSchema),
  })

  const modalTitle = getModalTitle(type)

  const createConfigMutation = useMutation({
    mutationFn: (data: FormDataType) => httpClient.post<NotificationsServiceSettings>(`/settings/${type}`, data),
    onSuccess: () => {
      pushSuccess('Configuration created')
      switch (type) {
        case NotificationsServiceEnum.EMAIL:
          queryClient.invalidateQueries(['settings', 'plex'])
          break
      }
      onClose()
    },
    onError: () => {
      pushDanger('Cannot create configuration')
    },
  })

  const onSubmit = handleSubmit((data) => {
    createConfigMutation.mutate(data)
  })

  useEffect(() => {
    if (isOpen) setType(undefined)
  }, [isOpen])

  return (
    <FormProvider handleSubmit={handleSubmit} formState={formState} reset={reset} getValues={getValues} {...form}>
      <Modal
        title={modalTitle}
        isOpen={isOpen}
        onClose={onClose}
        hasCloseFooterButton={true}
        onSubmit={onSubmit}
        Footer={
          type ? (
            <Button type="submit" disabled={!formState.isValid}>
              Save
            </Button>
          ) : undefined
        }
        {...props}
      >
        {!type && (
          <>
            <div className="grid grid-cols-1 gap-3">
              <SettingsPreviewCard onClick={() => setType(NotificationsServiceEnum.EMAIL)}>Email</SettingsPreviewCard>
            </div>
          </>
        )}

        {!createConfigMutation.isLoading && type === NotificationsServiceEnum.EMAIL && <EmailSettingsForm />}

        {createConfigMutation.isLoading && <Spinner />}
      </Modal>
    </FormProvider>
  )
}
