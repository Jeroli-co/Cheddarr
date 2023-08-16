import { useEffect, useMemo, useState } from 'react'
import { RadarrSettingsForm } from './RadarrSettingsForm'
import { Button } from '../elements/button/Button'
import { Modal, ModalProps } from '../elements/modal/Modal'
import { SettingsPreviewCard } from './ConfigPreviewCard'
import { FormProvider, useForm } from 'react-hook-form'
import httpClient from '../utils/http-client'
import { useMutation, useQueryClient } from 'react-query'
import { useAlert } from '../shared/contexts/AlertContext'
import { Spinner } from '../shared/components/Spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  MediaProviderEnum,
  MediaProviderSettings,
  postRadarrSettingsSchema,
  postSonarrSettingsSchema,
} from '../schemas/media-servers'
import { z } from 'zod'
import { SonarrSettingsForm } from './SonarrSettingsForm'

const getModalTitle = (mediaProviderType?: MediaProviderEnum) => {
  switch (mediaProviderType) {
    case MediaProviderEnum.RADARR:
      return 'Add Radarr configuration'
    case MediaProviderEnum.SONARR:
      return 'Add Sonarr configuration'
    default:
      return 'Choose a media provider'
  }
}

type PickMediaProvidersTypeModalProps = ModalProps

export const PickMediaProviderTypeModal: React.FC<PickMediaProvidersTypeModalProps> = ({
  isOpen,
  onClose,
  ...props
}) => {
  const queryClient = useQueryClient()
  const { pushDanger, pushSuccess } = useAlert()

  const [type, setType] = useState<MediaProviderEnum>()

  const resolverSchema = useMemo(() => {
    switch (type) {
      case MediaProviderEnum.RADARR:
        return postRadarrSettingsSchema
      case MediaProviderEnum.SONARR:
        return postSonarrSettingsSchema
      default:
        return z.object({})
    }
  }, [type])

  type FormDataType = z.infer<typeof resolverSchema>

  const { handleSubmit, formState, reset, getValues, ...form } = useForm<FormDataType>({
    mode: 'onBlur',
    resolver: zodResolver(resolverSchema),
    defaultValues: {
      version: 3,
    },
  })

  const modalTitle = getModalTitle(type)

  const createConfigMutation = useMutation({
    mutationFn: (data: FormDataType) => httpClient.post<MediaProviderSettings>(`/settings/${type}`, data),
    onSuccess: () => {
      pushSuccess('Configuration created')
      switch (type) {
        case MediaProviderEnum.RADARR:
          queryClient.invalidateQueries(['settings', 'radarr'])
          break
        case MediaProviderEnum.SONARR:
          queryClient.invalidateQueries(['settings', 'sonarr'])
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
              <SettingsPreviewCard onClick={() => setType(MediaProviderEnum.RADARR)}>Radarr</SettingsPreviewCard>
              <SettingsPreviewCard onClick={() => setType(MediaProviderEnum.SONARR)}>Sonarr</SettingsPreviewCard>
            </div>
          </>
        )}

        {!createConfigMutation.isLoading && type === MediaProviderEnum.RADARR && <RadarrSettingsForm />}
        {!createConfigMutation.isLoading && type === MediaProviderEnum.SONARR && <SonarrSettingsForm />}

        {createConfigMutation.isLoading && <Spinner />}
      </Modal>
    </FormProvider>
  )
}
