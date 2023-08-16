import { useState } from 'react'
import { PickNotificationsServiceTypeModal } from '../../components/PickNotificationsServiceTypeModal'
import { useRoleGuard } from '../../shared/hooks/useRoleGuard'
import { Roles } from '../../shared/enums/Roles'
import { useData } from '../../hooks/useData'
import { Info } from '../../elements/Info'
import { Title } from '../../elements/Title'
import { SettingsPreviewCard } from '../../components/ConfigPreviewCard'
import { Icon } from '../../shared/components/Icon'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Spinner } from '../../shared/components/Spinner'
import {
  EmailSettings,
  NotificationsServiceEnum,
  NotificationsServiceSettings,
} from '../../schemas/notifications-services'
import { EditNotificationsServiceSettingsModal } from '../../components/EditNotificationsServiceSettingsModal'

type NotificationsServiceSettingsPreviewCardProps = {
  type: NotificationsServiceEnum
  data: NotificationsServiceSettings
}

const NotificationsServiceSettingsPreviewCard = ({ data, type }: NotificationsServiceSettingsPreviewCardProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <SettingsPreviewCard onClick={() => setIsOpen(true)}>{type}</SettingsPreviewCard>
      <EditNotificationsServiceSettingsModal type={type} isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
    </>
  )
}

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, isFetching } = useData<EmailSettings>(
    ['notifications/agents', 'email'],
    '/notifications/agents/email',
  )

  useRoleGuard([Roles.ADMIN])

  return (
    <>
      <Title as="h1">Configure your notifications services</Title>

      <div className="space-y-8">
        <Info>More notifications systems are coming soon</Info>

        <p>Link your notifications services to your Cheddarr server.</p>

        <SettingsPreviewCard onClick={() => setIsOpen(true)} className="w-full">
          <Icon icon={faPlus} size="xl" />
        </SettingsPreviewCard>

        <div>
          <Title as="h2">Current configurations</Title>

          {(isLoading || isFetching) && (
            <SettingsPreviewCard className="border-0">
              <Spinner size="sm" />
            </SettingsPreviewCard>
          )}

          {!isLoading && data && (
            <NotificationsServiceSettingsPreviewCard type={NotificationsServiceEnum.EMAIL} data={data} />
          )}

          {!isLoading && !data && <p>You have no notifications service configured</p>}
        </div>
      </div>

      <PickNotificationsServiceTypeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
