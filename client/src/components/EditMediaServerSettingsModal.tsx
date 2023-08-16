import { useMutation, useQueryClient } from 'react-query'
import { Modal, ModalProps } from '../elements/modal/Modal'
import {
  MediaServerEnum,
  MediaServerSettings,
  PlexSettings,
  PostPlexSettings,
  postPlexSettingsSchema,
} from '../schemas/media-servers'
import { useAlert } from '../shared/contexts/AlertContext'
import { useMemo } from 'react'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import httpClient from '../utils/http-client'
import { Button } from '../elements/button/Button'
import { Spinner } from '../shared/components/Spinner'
import { PlexSettingsForm } from './PlexSettingsForm'
import { cn } from '../utils/strings'

type EditMediaServerSettingsModalProps<TData extends MediaServerSettings> = ModalProps & {
  type: MediaServerEnum
  data: TData
}

export const EditMediaServerSettingsModal = <TData extends MediaServerSettings>({
  isOpen,
  onClose,
  type,
  data,
  ...props
}: EditMediaServerSettingsModalProps<TData>) => {
  const queryClient = useQueryClient()
  const { pushDanger, pushSuccess } = useAlert()

  const resolverSchema = useMemo(() => {
    switch (type) {
      case MediaServerEnum.PLEX:
        return postPlexSettingsSchema
    }
  }, [type])

  type FormDataType = z.infer<typeof resolverSchema>

  const defaultValues = useMemo(() => {
    switch (type) {
      case MediaServerEnum.PLEX:
        return data as PostPlexSettings
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

        {type === MediaServerEnum.PLEX && (
          <PlexSettingsForm
            defaultSettings={data as PlexSettings}
            className={cn(updateConfigMutation.isLoading && 'invisible')}
          />
        )}
      </Modal>
    </FormProvider>
  )
}
