import { useEffect, useRef } from 'react'
import { Media } from './Media'
import { Spinner } from '../Spinner'
import { H2 } from '../Titles'
import { Row } from '../layout/Row'
import { MediaPreviewCard } from './MediaPreviewCard'
import { Episode } from '../../../components/Episode'
import { useSeason } from '../../../hooks/useMedia'

type SeasonProps = {
  seriesId: string
  seasonNumber: number
  episodeNumber?: number
}

export const Season = (props: SeasonProps) => {
  const { data, isLoading } = useSeason(props.seriesId, props.seasonNumber)
  const seasonRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (seasonRef.current) {
      seasonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    }
  }, [data])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <Media mediaRef={seasonRef} data={data} />
      <H2>Episodes</H2>
      <Row>
        {data &&
          data.episodes &&
          data.episodes.map((episode) => (
            <MediaPreviewCard key={episode.episodeNumber} media={episode} />
          ))}
      </Row>
      {data && props.episodeNumber && (
        <>
          <Episode
            seriesId={props.seriesId}
            seasonNumber={props.seasonNumber}
            episodeNumber={props.episodeNumber}
          />
        </>
      )}
    </>
  )
}
