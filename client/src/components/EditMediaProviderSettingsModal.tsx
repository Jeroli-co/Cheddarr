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

  const { handleSubmit, formState, reset, getValues, ...form } = useForm<FormDataType>({
    mode: 'onBlur',
    resolver: zodResolver(resolverSchema),
    defaultValues,
  })

  const deleteConfigMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/settings/${type}/${id}`),
    onSuccess: () => {
      pushSuccess('Configuration deleted')
      closeModal()
      queryClient.invalidateQueries(['settings', type])
    },
    onError: () => {
      pushDanger('Cannot delete configuration')
    },
  })

  const updateConfigMutation = useMutation({
    mutationFn: (postData: FormDataType) => httpClient.put<TData>(`/settings/${type}/${data.id}`, postData),
    onSuccess: () => {
      pushSuccess('Configuration updated')
      closeModal()
      queryClient.invalidateQueries(['settings', 'radarr'])
    },
    onError: () => {
      pushDanger('Cannot update configuration')
    },
  })

  const onSubmit = handleSubmit((postData) => {
    updateConfigMutation.mutate(postData)
  })

  const closeModal = () => {
    reset()
    onClose()
  }

  return (
    <FormProvider handleSubmit={handleSubmit} formState={formState} reset={reset} getValues={getValues} {...form}>
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
        {type === MediaProviderEnum.RADARR && <RadarrSettingsForm defaultSettings={data as RadarrSettings} />}
        {type === MediaProviderEnum.SONARR && <SonarrSettingsForm defaultSettings={data as SonarrSettings} />}
      </Modal>
    </FormProvider>
  )
}
