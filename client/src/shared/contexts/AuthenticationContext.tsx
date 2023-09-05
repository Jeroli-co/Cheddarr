import { createContext, useContext } from 'react'
import { useNavigate } from 'react-router'
import { useAPI } from '../hooks/useAPI'
import { useSession } from './SessionContext'
import { IEncodedToken } from '../models/IEncodedToken'
import { useAlert } from './AlertContext'
import { ERRORS_MESSAGE } from '../enums/ErrorsMessage'
import { DefaultAsyncCall, IAsyncCall } from '../models/IAsyncCall'
import { APIRoutes } from '../enums/APIRoutes'
import { SignUpFormData } from '../../pages/auth/sign-up'
import { SignInFormData } from '../../pages/auth/sign-in'
import { routes } from '../../routes'

interface IAuthenticationContextInterface {
  readonly signUp: (data: SignUpFormData) => Promise<IAsyncCall | IAsyncCall<null>>
  readonly signIn: (data: SignInFormData, redirectURI?: string) => Promise<IAsyncCall | IAsyncCall<null>>
}

const AuthenticationContextDefaultImpl: IAuthenticationContextInterface = {
  signUp(): Promise<IAsyncCall | IAsyncCall<null>> {
    return Promise.resolve(DefaultAsyncCall)
  },
  signIn(): Promise<IAsyncCall | IAsyncCall<null>> {
    return Promise.resolve(DefaultAsyncCall)
  },
}

const AuthenticationContext = createContext<IAuthenticationContextInterface>(AuthenticationContextDefaultImpl)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (props: any) => {
  const navigate = useNavigate()
  const { post } = useAPI()
  const { initSession } = useSession()
  const { pushSuccess, pushDanger } = useAlert()

  const signUp = async (data: SignUpFormData) => {
    const res = await post<IEncodedToken>(APIRoutes.SIGN_UP, data)
    if (res.status === 201) {
      pushSuccess('Account created')
      navigate('/')
      if (res.data) {
        initSession(res.data)
      }
    }
    return res
  }

  const signIn = async (data: SignInFormData, redirectURI?: string) => {
    const res = await post<IEncodedToken>(APIRoutes.SIGN_IN, { ...data })
    if (res.data && res.status === 200) {
      initSession(res.data)
      navigate(redirectURI ?? routes.HOME.url, { replace: true })
    } else if (res.status === 401) {
      pushDanger('Wrong credentials')
    } else if (res.status === 400) {
      pushDanger('Account needs to be confirmed')
    } else {
      pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status))
    }
    return res
  }

  return (
    <AuthenticationContext.Provider
      value={{
        signUp,
        signIn,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  )
}

export const useAuthentication = () => useContext(AuthenticationContext)
