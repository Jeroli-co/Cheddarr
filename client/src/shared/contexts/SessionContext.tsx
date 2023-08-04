import { createContext, useContext, useEffect, useState } from 'react'
import { ISession, SessionDefaultImpl } from '../models/ISession'
import { IEncodedToken } from '../models/IEncodedToken'
import { routes } from '../../routes'
import { instance } from '../../utils/http-client'
import { APIRoutes } from '../enums/APIRoutes'
import { ERRORS_MESSAGE } from '../enums/ErrorsMessage'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useAlert } from './AlertContext'
import { useAPI } from '../hooks/useAPI'
import { IUser } from '../models/IUser'

interface ISessionContextInterface {
  session: ISession
  initSession: (encodedToken: IEncodedToken) => void
  invalidSession: () => void
  updateUser: (user: IUser) => void
}

const SessionContextDefaultImpl: ISessionContextInterface = {
  session: SessionDefaultImpl,
  invalidSession(): void {},
  initSession(): void {},
  updateUser(): void {},
}

const SessionContext = createContext<ISessionContextInterface>(SessionContextDefaultImpl)

export const SessionContextProvider = (props: any) => {
  const [session, setSession] = useState(SessionDefaultImpl)
  const location = useLocation()
  const navigate = useNavigate()
  const { pushDanger, pushSuccess } = useAlert()
  const { get } = useAPI()

  useEffect(() => {
    if (session.isLoading) {
      if (location.pathname === routes.CONFIRM_PLEX_SIGNIN.url) {
        instance.get<IEncodedToken>(APIRoutes.CONFIRM_PLEX_SIGN_IN(location.search)).then(
          (res) => {
            if (res.status === 200 || (res.status === 201 && res.data)) {
              initSession(res.data)
              let redirectURI = res.headers['redirect-uri']
              if (redirectURI && redirectURI.length > 0) {
                navigate(redirectURI)
              }
            }
            if (res.status === 201) {
              pushSuccess('Account created')
              setSession({ ...session, isLoading: false })
              navigate(routes.SIGN_IN.url(''))
            }
          },
          (error) => {
            console.error(error.status)
            if (error.response && error.response.status) {
              pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status))
              setSession({ ...session, isLoading: false })
              navigate(routes.SIGN_IN.url(''))
            }
          },
        )
      } else {
        const encodedSession = getEncodedSession()
        if (encodedSession) {
          initSession(encodedSession)
        } else {
          invalidSession()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isLoading])

  useEffect(() => {
    if (session.isAuthenticated) {
      get<IUser>(APIRoutes.USER).then((res) => {
        if (res.status === 200) {
          setSession({ ...session, user: res.data ?? undefined })
        } else {
          invalidSession()
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isAuthenticated])

  const getEncodedSession = (): IEncodedToken | null => {
    const tokenType = localStorage.getItem('token_type') ?? undefined
    const accessToken = localStorage.getItem('access_token') ?? undefined
    if (tokenType !== undefined && accessToken !== undefined) {
      return {
        access_token: accessToken,
        token_type: tokenType,
      }
    } else {
      return null
    }
  }

  const initSession = (encodedToken: IEncodedToken) => {
    localStorage.setItem('token_type', encodedToken.token_type)
    localStorage.setItem('access_token', encodedToken.access_token)
    setSession({
      isAuthenticated: true,
      user: undefined,
      isLoading: false,
    })
  }

  const invalidSession = () => {
    localStorage.removeItem('token_type')
    localStorage.removeItem('access_token')
    setSession({
      ...SessionDefaultImpl,
      isLoading: false,
    })
  }

  const updateUser = (user: IUser) => {
    if (session.isAuthenticated && session.user) {
      setSession({ ...session, user: user })
    }
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        initSession,
        invalidSession,
        updateUser,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
