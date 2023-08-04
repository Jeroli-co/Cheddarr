import { IMediaRequest } from '../shared/models/IMediaRequest'
import { usePagination } from './usePagination'

export const useIncomingRequest = () =>
  usePagination<IMediaRequest>(['requests', 'incoming'], '/requests/incoming')
export const useOutgoingRequest = () =>
  usePagination<IMediaRequest>(['requests', 'outgoing'], '/requests/outgoing')
