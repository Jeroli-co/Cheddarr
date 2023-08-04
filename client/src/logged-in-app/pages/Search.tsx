import { useParams } from 'react-router'
import { SearchFilters } from '../../shared/enums/SearchFilters'
import { MediaPreviewCard } from '../../shared/components/media/MediaPreviewCard'
import styled from 'styled-components'
import { IMedia } from '../../shared/models/IMedia'
import { MediaCardsLoader } from '../../shared/components/media/MediaCardsLoader'
import { usePagination } from '../../hooks/usePagination'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`

type SearchParams = {
  title: string
  type: SearchFilters
}

export const Search = () => {
  const { title, type } = useParams<SearchParams>()

  if (!title) throw new Error('Title is required')
  if (!type) throw new Error('Type is required')

  const { data, isLoading, isFetching } = usePagination<IMedia>(
    ['search', title, type],
    '/search',
    {
      value: title,
      type,
    }
  )

  if (isLoading || isFetching) return <MediaCardsLoader n={20} />

  if (!data) <p>Not results found</p>

  return (
    <Container>
      {data?.results.map((m, index) => <MediaPreviewCard key={index} media={m} />)}
    </Container>
  )
}

export default Search
