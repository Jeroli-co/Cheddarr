import { MediaPreviewCard } from '../shared/components/media/MediaPreviewCard'
import { IMedia } from '../shared/models/IMedia'
import { MediaCardsLoader } from '../shared/components/media/MediaCardsLoader'
import { usePagination } from '../hooks/usePagination'
import { useSearchParams } from 'react-router-dom'
import { Pagination } from '../elements/Pagination'
import { SearchBar } from '../logged-in-app/SearchBar'

export default () => {
  const [searchParams] = useSearchParams()

  const type = searchParams.get('type') ?? undefined
  const value = searchParams.get('value') ?? undefined

  const queryKeys = ['search', type, value].filter((e) => !!e) as string[]

  let querySearchParams = {}

  if (type) {
    querySearchParams = { ...querySearchParams, type }
  }

  if (value) {
    querySearchParams = { ...querySearchParams, value }
  }

  const { data, isLoading, isFetching, ...rest } = usePagination<IMedia>(
    queryKeys,
    '/search',
    new URLSearchParams(querySearchParams).toString(),
    { enabled: !!value && value.trim().length > 0 },
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
