import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MediaServerEnum, MediaServerSettings, postPlexSettingsSchema } from '../schemas/media-servers'
import { useAlert } from '../shared/contexts/AlertContext'
import httpClient from '../utils/http-client'
import { SettingsPreviewCard } from './ConfigPreviewCard'
import { Spinner } from '../shared/components/Spinner'
import { Modal, ModalProps } from '../elements/modal/Modal'
import { Button } from '../elements/button/Button'
import { PlexSettingsForm } from './PlexSettingsForm'

const getModalTitle = (mediaServerType?: MediaServerEnum) => {
  switch (mediaServerType) {
    case MediaServerEnum.PLEX:
      return 'Add Plex configuration'
    default:
      return 'Choose a media server'
  }
}

type PickMediaServersTypeModalProps = ModalProps

export const PickMediaServerTypeModal: React.FC<PickMediaServersTypeModalProps> = ({ isOpen, onClose, ...props }) => {
  const queryClient = useQueryClient()
  const { pushDanger, pushSuccess } = useAlert()

  const [type, setType] = useState<MediaServerEnum>()

  const resolverSchema = useMemo(() => {
    switch (type) {
      case MediaServerEnum.PLEX:
        return postPlexSettingsSchema
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
    mutationFn: (data: FormDataType) => httpClient.post<MediaServerSettings>(`/settings/${type}`, data),
    onSuccess: () => {
      pushSuccess('Configuration created')
      switch (type) {
        case MediaServerEnum.PLEX:
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SettingsPreviewCard onClick={() => setType(MediaServerEnum.PLEX)}>Plex</SettingsPreviewCard>
            </div>
          </>
        )}

        {!createConfigMutation.isLoading && type === MediaServerEnum.PLEX && <PlexSettingsForm />}

        {createConfigMutation.isLoading && <Spinner />}
      </Modal>
    </FormProvider>
  )
}
