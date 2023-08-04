import { useParams } from 'react-router'
import { Media } from '../../shared/components/media/Media'
import { useMovie } from '../../hooks/useMedia'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return undefined
  }

  const { data, isLoading } = useMovie(id)

  if (isLoading) {
    return undefined
  }

  if (!data) return <p className="text-danger">Movie info not available</p>

  return <Media data={data} />
}
