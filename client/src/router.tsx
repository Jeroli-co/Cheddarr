import React from 'react'
import { PageLoaderModal } from './shared/components/PageLoaderModal'
import { Routes, Route, Navigate } from 'react-router'
import { useSession } from './shared/contexts/SessionContext'

const AuthRouter = React.lazy(() => import('./pages/auth/router'))
const Router = React.lazy(() => import('./pages'))

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const {
    session: { isAuthenticated },
  } = useSession()
  return (
    <React.Suspense fallback={<PageLoaderModal />}>
      <Routes>
        <Route path="auth/*" element={!isAuthenticated ? <AuthRouter /> : <Navigate to="/" />} />
        <Route index path="*" element={isAuthenticated ? <Router /> : <Navigate to="/auth" />} />
      </Routes>
    </React.Suspense>
  )
}