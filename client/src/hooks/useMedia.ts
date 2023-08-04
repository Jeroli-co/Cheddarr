import { MediaTypes } from '../shared/enums/MediaTypes'
import { IEpisode, IMedia, IMovie, ISeason, ISeries } from '../shared/models/IMedia'
import { usePagination } from './usePagination'
import { useData } from './useData'

export const useMedia = (type: MediaTypes, id: string) => {
  const queryKeys = [type === MediaTypes.MOVIES ? 'movies' : 'series', id]
  const queryURL = `/${type === MediaTypes.MOVIES ? 'movies' : 'series'}/${id}`

  return useData<IMedia>(queryKeys, queryURL)
}

export const useMovie = (id: string) => useData<IMovie>(['movie', id], `/movies/${id}`)

export const useSeries = (id: string) => useData<ISeries>(['series', id], `/series/${id}`)

export const useSeason = (seriesID: string, seasonNumber: number) =>
  useData<ISeason>(
    ['series', seriesID, seasonNumber.toString()],
    `/series/${seriesID}/seasons/${seasonNumber}`
  )

export const useEpisode = (seriesID: string, seasonNumber: number, episodeNumber: number) =>
  useData<IEpisode>(
    ['episode', seriesID, seasonNumber.toString(), episodeNumber.toString()],
    `/series/${seriesID}/seasons/${seasonNumber}/episodes/${episodeNumber}`
  )

export const useRecentMovies = () => usePagination<IMovie>(['movies', 'recent'], '/movies/recent')
export const usePopularMovies = () =>
  usePagination<IMovie>(['movies', 'popular'], '/movies/popular')
export const useUpcomingMovies = () =>
  usePagination<IMovie>(['movies', 'upcoming'], '/movies/upcoming')
export const useRecommendedMovies = (id: string) =>
  usePagination<IMovie>(['movies', 'recommended', id], `/movies/${id}/recommended`)
export const useSimilarMovies = (id: string) =>
  usePagination<IMovie>(['movies', 'similar', id], `/movies/${id}/similar`)

export const useRecentSeries = () => usePagination<ISeries>(['series', 'recent'], '/series/recent')
export const usePopularSeries = () =>
  usePagination<ISeries>(['series', 'popular'], '/series/popular')
export const useUpcomingSeries = () =>
  usePagination<ISeries>(['series', 'upcoming'], '/series/upcoming')
export const useRecommendedSeries = (id: string) =>
  usePagination<ISeries>(['series', 'recommended', id], `/series/${id}/recommended`)
export const useSimilarSeries = (id: string) =>
  usePagination<ISeries>(['series', 'similar', id], `/series/${id}/similar`)
