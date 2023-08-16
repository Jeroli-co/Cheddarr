import { useMutation, useQueryClient } from 'react-query'
import { Modal, ModalProps } from '../elements/modal/Modal'
import { useAlert } from '../shared/contexts/AlertContext'
import { useMemo } from 'react'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import httpClient from '../utils/http-client'
import { Button } from '../elements/button/Button'
import { Spinner } from '../shared/components/Spinner'
import { cn } from '../utils/strings'
import {
  EmailSettings,
  NotificationsServiceEnum,
  NotificationsServiceSettings,
  PostEmailSettings,
  postNotificationsServiceSettingsSchema,
} from '../schemas/notifications-services'
import { EmailSettingsForm } from './EmailSettingsForm'

type EditNotificationsServiceSettingsModalProps<TData extends NotificationsServiceSettings> = ModalProps & {
  type: NotificationsServiceEnum
  data: TData
}

export const EditNotificationsServiceSettingsModal = <TData extends NotificationsServiceSettings>({
  isOpen,
  onClose,
  type,
  data,
  ...props
}: EditNotificationsServiceSettingsModalProps<TData>) => {
  const queryClient = useQueryClient()
  const { pushDanger, pushSuccess } = useAlert()

  const resolverSchema = useMemo(() => {
    switch (type) {
      case NotificationsServiceEnum.EMAIL:
        return postNotificationsServiceSettingsSchema
    }
  }, [type])

  type FormDataType = z.infer<typeof resolverSchema>

  const defaultValues = useMemo(() => {
    switch (type) {
      case NotificationsServiceEnum.EMAIL:
        return data as PostEmailSettings
    }
  }, [type])

  const { handleSubmit, formState, getValues, ...form } = useForm<FormDataType>({
    mode: 'onBlur',
    resolver: zodResolver(resolverSchema),
    defaultValues,
    reValidateMode: 'onSubmit',
  })

  const deleteConfigMutation = useMutation({
    mutationFn: () => httpClient.delete(`/settings/agents/${type}`),
    onSuccess: () => {
      pushSuccess('Configuration deleted')
      queryClient.invalidateQueries(['settings', type])
      onClose()
    },
    onError: () => {
      pushDanger('Cannot delete configuration')
    },
  })

  const updateConfigMutation = useMutation({
    mutationFn: (postData: FormDataType) => httpClient.put<TData>(`/settings/agents/${type}`, postData),
    onSuccess: () => {
      pushSuccess('Configuration updated')
      queryClient.invalidateQueries(['settings', type])
      onClose()
    },
    onError: () => {
      pushDanger('Cannot update configuration')
    },
  })

  const onSubmit = handleSubmit((postData) => {
    updateConfigMutation.mutate(postData)
  })

  return (
    <FormProvider handleSubmit={handleSubmit} formState={formState} getValues={getValues} {...form}>
      <Modal
        title={`Edit ${type} notifications service`}
        isOpen={isOpen}
        onClose={onClose}
        hasCloseFooterButton={true}
        onSubmit={onSubmit}
        Footer={
          <>
            <Button type="submit" disabled={!formState.isValid}>
              Save
            </Button>
            <Button type="button" color="danger" variant="outlined" onClick={() => deleteConfigMutation.mutate()}>
              Delete
            </Button>
          </>
        }
        {...props}
      >
        {updateConfigMutation.isLoading && (
          <Spinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}

        {type === NotificationsServiceEnum.EMAIL && (
          <EmailSettingsForm
            defaultSettings={data as EmailSettings}
            className={cn(updateConfigMutation.isLoading && 'invisible')}
          />
        )}
      </Modal>
    </FormProvider>
  )
}
