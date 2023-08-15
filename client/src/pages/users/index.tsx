import React from 'react'
import { useRoleGuard } from '../../shared/hooks/useRoleGuard'
import { Roles } from '../../shared/enums/Roles'
import { PageLoaderModal } from '../../shared/components/PageLoaderModal'
import { Navigate, Route, Routes } from 'react-router'
import { Tabs, TabsConfig } from '../../elements/Tabs'

const ConfirmedUsersPage = React.lazy(() => import('./confirmed'))
const PendingUsersPage = React.lazy(() => import('./pending'))

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const tabs: TabsConfig = [
    { label: 'Confirmed', uri: 'confirmed' },
    { label: 'Pending', uri: 'pending' },
  ]

  useRoleGuard([Roles.MANAGE_USERS])

  return (
    <Tabs config={tabs}>
      <React.Suspense fallback={<PageLoaderModal />}>
        <Routes>
          <Route index element={<Navigate to="./confirmed" />} />
          <Route path="confirmed" element={<ConfirmedUsersPage />} />
          <Route path="pending" element={<PendingUsersPage />} />
        </Routes>
      </React.Suspense>
    </Tabs>
  )
}
