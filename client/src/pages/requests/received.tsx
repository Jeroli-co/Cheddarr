import { RequestTable } from '../../components/RequestTable'
import { RequestTypes } from '../../shared/enums/RequestTypes'
import { useIncomingRequest } from '../../hooks/useRequests'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const pagination = useIncomingRequest()

  return <RequestTable requestType={RequestTypes.INCOMING} {...pagination} />
}
