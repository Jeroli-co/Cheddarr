import { useState } from 'react'
import { AddItemBox, SpinnerItemBox } from '../../shared/components/ItemBox'
import { EmailSettingsBoxPreview } from '../../logged-in-app/pages/settings/notifications/email/EmailSettingsBoxPreview'
import { PickNotificationsServiceTypeModal } from '../../logged-in-app/pages/settings/notifications/PickNotificationsServiceTypeModal'
import { useRoleGuard } from '../../shared/hooks/useRoleGuard'
import { Roles } from '../../shared/enums/Roles'
import { useData } from '../../hooks/useData'
import { EmailSettings } from '../../logged-in-app/pages/settings/notifications/email/EmailSettingsForm'
import { Info } from '../../elements/Info'
import { Title } from '../../elements/Title'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [isPickNotificationsServicesTypeModalOpen, setIsPickNotificationsServicesTypeModalOpen] = useState(false)

  const { data, isLoading } = useData<EmailSettings>(['notifications/agents', 'email'], '/notifications/agents/email')

  useRoleGuard([Roles.ADMIN])

  return (
    <div>
      <Info>More notifications systems are coming soon</Info>

      <Title as="h1">Configure your notifications service</Title>

      <AddItemBox onClick={() => setIsPickNotificationsServicesTypeModalOpen(true)} />

      {isLoading && <SpinnerItemBox />}

      {!isLoading && data && <EmailSettingsBoxPreview data={data} />}

      {isPickNotificationsServicesTypeModalOpen && (
        <PickNotificationsServiceTypeModal closeModal={() => setIsPickNotificationsServicesTypeModalOpen(false)} />
      )}
    </div>
  )
}
