import { RequestTypes } from '../../shared/enums/RequestTypes'
import { RequestTable } from '../../components/RequestTable'
import { useOutgoingRequest } from '../../hooks/useRequests'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const pagination = useOutgoingRequest()

  return <RequestTable requestType={RequestTypes.OUTGOING} {...pagination} />
}
