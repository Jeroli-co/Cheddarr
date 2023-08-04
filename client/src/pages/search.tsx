import { SearchFilters } from '../shared/enums/SearchFilters'
import { MediaPreviewCard } from '../shared/components/media/MediaPreviewCard'
import { IMedia } from '../shared/models/IMedia'
import { MediaCardsLoader } from '../shared/components/media/MediaCardsLoader'
import { usePagination } from '../hooks/usePagination'
import { useSearchParams } from 'react-router-dom'
import { Pagination } from '../elements/Pagination'
import { SearchBar } from '../logged-in-app/SearchBar'

export default () => {
  const [searchParams] = useSearchParams()

  const type = searchParams.get('type') || SearchFilters.ALL
  const value = searchParams.get('value') || ''

  const { data, isLoading, isFetching, ...rest } = usePagination<IMedia>(
    ['search', type, value],
    '/search',
    new URLSearchParams({ type, value }).toString(),
    { enabled: value.trim().length > 0 },
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="md:hidden">
        <SearchBar />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {(isLoading || isFetching) && <MediaCardsLoader n={20} />}
        {!(isLoading || isFetching) &&
          data?.results.length &&
          data.results.map((m, index) => <MediaPreviewCard key={index} media={m} />)}
      </div>

      {!(isLoading || isFetching) && !data?.results.length && (
        <div className="w-full">
          <p className="text-center">
            {value ? 'No results for ' + <b>{value}</b> : 'Use the search bar to find new content !'}
          </p>
        </div>
      )}

      {!(isLoading || isFetching) && data?.results && (
        <Pagination data={data} isLoading={isLoading} isFetching={isFetching} {...rest} />
      )}
    </div>
  )
}
