import { MediaSlider } from '../components/MediaSlider'
import {
  useRecentMovies,
  useRecentSeries,
  usePopularMovies,
  usePopularSeries,
  useUpcomingMovies,
} from '../hooks/useMedia'
import { useData } from '../hooks/useData'
import { Title } from '../elements/Title'
import { useSession } from '../shared/contexts/SessionContext'
import { PlexSettings } from '../schemas/media-servers'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const {
    session: { user },
  } = useSession()
  const { data: plexSettings, isLoading: isPlexSettingsLoading } = useData<PlexSettings[]>(
    ['settings', 'plex'],
    '/settings/plex',
  )

  const { data: recentMovies, isLoading: isRecentMoviesLoading } = useRecentMovies()
  const { data: recentSeries, isLoading: isRecentSeriesLoading } = useRecentSeries()
  const { data: popularMovies, isLoading: isPopularMoviesLoading } = usePopularMovies()
  const { data: popularSeries, isLoading: isPopularSeriesLoading } = usePopularSeries()
  const { data: upcomingMovies, isLoading: isUpcomingMoviesLoading } = useUpcomingMovies()
  // const { data: upcomingSeries, isLoading: isUpcomingSeriesLoading } = useUpcomingSeries()

  return (
    <div className="space-y-8">
      <div className="bg-primary-dark p-4 rounded-lg space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-16 hidden md:block">
            <img className="w-full h-auto" src="/assets/cheddarr-min.svg" alt="Chedarr" />
          </div>

          <div>
            <Title as="h1" className="mb-0">
              Welcome to Cheddarr <span className="text-tertiary">{user?.username}</span> !
            </Title>
            <p>Explore new content everyday and request it any time !</p>
          </div>
        </div>
      </div>

      {!isPlexSettingsLoading && !!plexSettings?.length && (
        <>
          <MediaSlider
            title="Movies recently added"
            description="Discover the movies recently added to your Plex servers."
            data={recentMovies}
            isLoading={isRecentMoviesLoading}
          />
          <MediaSlider
            title="Series recently added"
            description="Discover the series recently added to your Plex servers."
            data={recentSeries}
            isLoading={isRecentSeriesLoading}
          />
        </>
      )}
      <MediaSlider
        title="Popular movies"
        description="People are enjoying those movies, will you ?"
        data={popularMovies}
        isLoading={isPopularMoviesLoading}
      />
      <MediaSlider
        title="Popular series"
        description="People are enjoying those series, will you ?"
        data={popularSeries}
        isLoading={isPopularSeriesLoading}
      />
      <MediaSlider
        title="Upcoming movies"
        description="Discover the movies that will be released soon."
        data={upcomingMovies}
        isLoading={isUpcomingMoviesLoading}
      />
      {/* <MediaSlider
          title="Upcoming series"
          description="Discover the series that will be released soon."
          data={upcomingSeries}
          isLoading={isUpcomingSeriesLoading}
        /> */}
    </div>
  )
}
