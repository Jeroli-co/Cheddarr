import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { useRoleGuard } from '../../shared/hooks/useRoleGuard'
import { Roles } from '../../shared/enums/Roles'
import { checkRole } from '../../utils/roles'
import { useSession } from '../../shared/contexts/SessionContext'
import { PageLoaderModal } from '../../shared/components/PageLoaderModal'
import { Tabs, TabsConfig } from '../../elements/Tabs'

const SentPage = React.lazy(() => import('./sent'))
const ReceivedPage = React.lazy(() => import('./received'))

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const {
    session: { user },
  } = useSession()

  useRoleGuard([Roles.REQUEST, Roles.MANAGE_REQUEST], true)

  const [tabs, setTabs] = useState<TabsConfig>([
    { label: 'Media servers', uri: 'media-servers' },
    { label: 'Media providers', uri: 'media-providers' },
  ])

  useEffect(() => {
    let tabsTmp: TabsConfig = []

    if (user && checkRole(user.roles, [Roles.MANAGE_REQUEST])) {
      tabsTmp = [{ label: 'Received', uri: 'received' }]
    }

    if (user && checkRole(user.roles, [Roles.REQUEST])) {
      tabsTmp = [...tabsTmp, { label: 'Sent', uri: 'sent' }]
    }

    setTabs(tabsTmp)
  }, [user])

  return (
    <Tabs config={tabs}>
      <React.Suspense fallback={<PageLoaderModal />}>
        <Routes>
          <Route index element={<Navigate to="./received" />} />
          {user && checkRole(user.roles, [Roles.MANAGE_REQUEST]) && (
            <Route path="received" element={<ReceivedPage />} />
          )}
          {user && checkRole(user.roles, [Roles.REQUEST]) && <Route path="sent" element={<SentPage />} />}
        </Routes>
      </React.Suspense>
    </Tabs>
  )
}
