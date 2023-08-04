import { IUser } from './IUser'

export interface ISession {
  isAuthenticated: boolean
  user?: IUser
  isLoading: boolean
}

export const SessionDefaultImpl: ISession = {
  isAuthenticated: false,
  user: undefined,
  isLoading: true,
}
