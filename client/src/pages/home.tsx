import { MediaSlider } from '../components/MediaSlider'
import {
  useRecentMovies,
  useRecentSeries,
  usePopularMovies,
  usePopularSeries,
  useUpcomingMovies,
  useUpcomingSeries,
} from '../hooks/useMedia'
import { useData } from '../hooks/useData'
import { PlexSettings } from '../logged-in-app/pages/settings/media-servers/plex/PlexSettingsForm'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { data: plexSettings, isLoading: isPlexSettingsLoading } = useData<PlexSettings[]>(
    ['settings', 'plex'],
    '/settings/plex'
  )

  const { data: recentMovies, isLoading: isRecentMoviesLoading } = useRecentMovies()
  const { data: recentSeries, isLoading: isRecentSeriesLoading } = useRecentSeries()
  const { data: popularMovies, isLoading: isPopularMoviesLoading } = usePopularMovies()
  const { data: popularSeries, isLoading: isPopularSeriesLoading } = usePopularSeries()
  const { data: upcomingMovies, isLoading: isUpcomingMoviesLoading } = useUpcomingMovies()
  const { data: upcomingSeries, isLoading: isUpcomingSeriesLoading } = useUpcomingSeries()

  return (
    <>
      {!isPlexSettingsLoading && plexSettings?.length && (
        <>
          <MediaSlider
            title="Movies recently added"
            data={recentMovies}
            isLoading={isRecentMoviesLoading}
          />
          <MediaSlider
            title="Series recently added"
            data={recentSeries}
            isLoading={isRecentSeriesLoading}
          />
        </>
      )}
      <MediaSlider title="Popular movies" data={popularMovies} isLoading={isPopularMoviesLoading} />
      <MediaSlider title="Popular series" data={popularSeries} isLoading={isPopularSeriesLoading} />
      <MediaSlider
        title="Upcoming movies"
        data={upcomingMovies}
        isLoading={isUpcomingMoviesLoading}
      />
      <MediaSlider
        title="Upcoming series"
        data={upcomingSeries}
        isLoading={isUpcomingSeriesLoading}
      />
    </>
  )
}
