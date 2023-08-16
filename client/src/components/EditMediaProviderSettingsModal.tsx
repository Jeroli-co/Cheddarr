import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../elements/button/Button'
import { ModalProps, Modal } from '../elements/modal/Modal'
import { useAlert } from '../shared/contexts/AlertContext'
import httpClient from '../utils/http-client'
import {
  MediaProviderEnum,
  MediaProviderSettings,
  PostRadarrSettings,
  PostSonarrSettings,
  RadarrSettings,
  SonarrSettings,
  postRadarrSettingsSchema,
  postSonarrSettingsSchema,
} from '../schemas/media-servers'
import { z } from 'zod'
import { RadarrSettingsForm } from './RadarrSettingsForm'
import { SonarrSettingsForm } from './SonarrSettingsForm'
import { Spinner } from '../shared/components/Spinner'
import { cn } from '../utils/strings'

type EditMediaProviderSettingsModalProps<TData extends MediaProviderSettings> = ModalProps & {
  type: MediaProviderEnum
  data: TData
}

export const EditMediaProviderSettingsModal = <TData extends MediaProviderSettings>({
  isOpen,
  onClose,
  type,
  data,
  ...props
}: EditMediaProviderSettingsModalProps<TData>) => {
  const queryClient = useQueryClient()
  const { pushDanger, pushSuccess } = useAlert()

  const resolverSchema = useMemo(() => {
    switch (type) {
      case MediaProviderEnum.RADARR:
        return postRadarrSettingsSchema
      case MediaProviderEnum.SONARR:
        return postSonarrSettingsSchema
    }
  }, [type])

  type FormDataType = z.infer<typeof resolverSchema>

  const defaultValues = useMemo(() => {
    switch (type) {
      case MediaProviderEnum.RADARR:
        return data as PostRadarrSettings
      case MediaProviderEnum.SONARR:
        return data as PostSonarrSettings
    }
  }, [type])

  const { handleSubmit, formState, getValues, ...form } = useForm<FormDataType>({
    mode: 'onBlur',
    resolver: zodResolver(resolverSchema),
    defaultValues,
    reValidateMode: 'onSubmit',
  })

  const deleteConfigMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/settings/${type}/${id}`),
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
    mutationFn: (postData: FormDataType) => httpClient.put<TData>(`/settings/${type}/${data.id}`, postData),
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
        title={`Edit ${data.name}`}
        isOpen={isOpen}
        onClose={onClose}
        hasCloseFooterButton={true}
        onSubmit={onSubmit}
        Footer={
          <>
            <Button type="submit" disabled={!formState.isValid}>
              Save
            </Button>
            <Button
              type="button"
              color="danger"
              variant="outlined"
              onClick={() => deleteConfigMutation.mutate(data.id)}
            >
              Delete
            </Button>
          </>
        }
        {...props}
      >
        {updateConfigMutation.isLoading && (
          <Spinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}

        {type === MediaProviderEnum.RADARR && (
          <RadarrSettingsForm
            defaultSettings={data as RadarrSettings}
            className={cn(updateConfigMutation.isLoading && 'invisible')}
          />
        )}
        {type === MediaProviderEnum.SONARR && (
          <SonarrSettingsForm
            defaultSettings={data as SonarrSettings}
            className={cn(updateConfigMutation.isLoading && 'invisible')}
          />
        )}
      </Modal>
    </FormProvider>
  )
}
