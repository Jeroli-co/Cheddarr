import { useState } from 'react'
import { FullWidthTag } from '../../shared/components/FullWidthTag'
import { H1 } from '../../shared/components/Titles'
import { AddItemBox, SpinnerItemBox } from '../../shared/components/ItemBox'
import { EmailSettingsBoxPreview } from '../../logged-in-app/pages/settings/notifications/email/EmailSettingsBoxPreview'
import { PickNotificationsServiceTypeModal } from '../../logged-in-app/pages/settings/notifications/PickNotificationsServiceTypeModal'
import { useRoleGuard } from '../../shared/hooks/useRoleGuard'
import { Roles } from '../../shared/enums/Roles'
import { useData } from '../../hooks/useData'
import { EmailSettings } from '../../logged-in-app/pages/settings/notifications/email/EmailSettingsForm'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [isPickNotificationsServicesTypeModalOpen, setIsPickNotificationsServicesTypeModalOpen] =
    useState(false)

  const { data, isLoading } = useData<EmailSettings>(
    ['notifications/agents', 'email'],
    '/notifications/agents/email'
  )

  useRoleGuard([Roles.ADMIN])

  return (
    <div>
      <FullWidthTag>More notifications systems are coming soon</FullWidthTag>
      <H1>Configure your notifications service</H1>
      <AddItemBox onClick={() => setIsPickNotificationsServicesTypeModalOpen(true)} />
      {isLoading && <SpinnerItemBox />}
      {!isLoading && data && <EmailSettingsBoxPreview data={data} />}
      {isPickNotificationsServicesTypeModalOpen && (
        <PickNotificationsServiceTypeModal
          closeModal={() => setIsPickNotificationsServicesTypeModalOpen(false)}
        />
      )}
    </div>
  )
}
