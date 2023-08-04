import { useEffect, useRef } from 'react'
import { Spinner } from '../shared/components/Spinner'
import { Media } from '../shared/components/media/Media'
import { useEpisode } from '../hooks/useMedia'

type EpisodeProps = {
  seriesId: string
  seasonNumber: number
  episodeNumber: number
}

export const Episode = ({ seriesId, seasonNumber, episodeNumber }: EpisodeProps) => {
  const { data, isLoading } = useEpisode(seriesId, seasonNumber, episodeNumber)

  const episodeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (episodeRef.current) {
      episodeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    }
  }, [data])

  if (isLoading) return <Spinner />

  if (!data) return <p className="text-danger">Episode info unavailable</p>

  return <Media mediaRef={episodeRef} data={data} />
}
