import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IMedia, isMovie, isOnServers, isSeries } from '../../models/IMedia'
import { H1, H2 } from '../Titles'
import { minToHoursMinutes } from '../../../utils/media-utils'
import { MediaRating } from './MediaRating'
import { MediaTag, SuccessTag, Tag } from '../Tag'
import { MediaPersonCarousel } from './MediaPersonCarousel'
import { PlayButton, PrimaryLinkButton } from '../Button'
import { STATIC_STYLES } from '../../enums/StaticStyles'
import { PrimaryDivider } from '../Divider'
import { Row } from '../layout/Row'
import { Icon } from '../Icon'
import { faFilm } from '@fortawesome/free-solid-svg-icons'
import { Buttons } from '../layout/Buttons'
import { MediaSlider } from '../../../components/MediaSlider'
import { useImage } from '../../hooks/useImage'
import { Image } from '../Image'
import { RequestButton } from '../requests/RequestButton'
import { Spinner } from '../Spinner'
import {
  useRecommendedMovies,
  useRecommendedSeries,
  useSimilarMovies,
  useSimilarSeries,
} from '../../../hooks/useMedia'

const BackgroundContainer = styled.div`
  position: relative;
  z-index: 0;
`

const Background = styled.div<{ image: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), ${(props) => props.theme.primary}),
    url('${(props) => props.image}');
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: cover;
  opacity: 0.2;
  z-index: -1;
`

const MediaHeader = styled.div`
  display: flex;
  padding: 20px;
  margin-bottom: 20px;

  span:first-child {
    flex: 1 1 0;
    @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
      width: 75%;
    }
  }

  span:nth-child(2) {
    flex: 4 1 0;
  }

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    flex-direction: column;
    align-items: center;
  }
`

const MediaHeaderInfo = styled.div`
  flex-grow: 3;
  padding: 5px 20px;

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    justify-content: center;
    text-align: center;
  }
`

const MediaHeaderTags = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    justify-content: center;
  }
`

const MediaHeaderSubInfo = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;

  .pipe-separator {
    margin: 0 20px;
  }

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    justify-content: center;
    flex-direction: column;
    margin-bottom: 20px;
    .pipe-separator {
      display: none;
    }
  }
`

const MediaHeaderTitle = styled(H1)`
  font-weight: bold;
  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    font-size: 20px;
  }

  .media-title-release-date {
    font-size: 16px;
    @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
      display: none;
    }
  }
`

const MediaCrewInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Bubble = styled.div`
  margin-top: 40px;
  flex-grow: 1;

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    width: 50%;
  }
`

const RecommendedMoviesSlider = ({ id }: { id: string }) => {
  const { data, isLoading } = useRecommendedMovies(id)
  return <MediaSlider title="Recommended" data={data} isLoading={isLoading} />
}

const RecommendedSeriesSlider = ({ id }: { id: string }) => {
  const { data, isLoading } = useRecommendedSeries(id)
  return <MediaSlider title="Recommended" data={data} isLoading={isLoading} />
}

const SimilarMoviesSlider = ({ id }: { id: string }) => {
  const { data, isLoading } = useSimilarMovies(id)
  return <MediaSlider title="Similar" data={data} isLoading={isLoading} />
}

const SimilarSeriesSlider = ({ id }: { id: string }) => {
  const { data, isLoading } = useSimilarSeries(id)
  return <MediaSlider title="Similar" data={data} isLoading={isLoading} />
}

type MediaProps = {
  data?: IMedia
  mediaRef?: any
  isLoading?: boolean
}

export const Media = ({ data, isLoading, mediaRef }: MediaProps) => {
  const [studio, setStudio] = useState<string | null>(null)
  const [directors, setDirectors] = useState<string[] | null>(null)
  const [producers, setProducers] = useState<string[] | null>(null)
  const [screenplay, setScreenplay] = useState<string[] | null>(null)
  const poster = useImage(data?.posterUrl)

  useEffect(() => {
    const directorsTmp: string[] = []
    const producersTmp: string[] = []
    const screenplayTmp: string[] = []

    if (data?.studios && data?.studios.length > 0) {
      setStudio(data?.studios[0].name)
    }
    if (data?.credits && data?.credits.crew) {
      data?.credits.crew.forEach((p) => {
        if (p.role === 'Director') {
          directorsTmp.push(p.name)
        } else if (p.role === 'Producer') {
          producersTmp.push(p.name)
        } else if (p.role === 'Screenplay') {
          screenplayTmp.push(p.name)
        }
      })
    }
    setDirectors(directorsTmp)
    setProducers(producersTmp)
    setScreenplay(screenplayTmp)
  }, [data])

  if (isLoading) return <Spinner />

  return (
    <span ref={mediaRef}>
      <BackgroundContainer>
        {data?.artUrl && <Background image={data?.artUrl} />}
        <MediaHeader>
          <span>
            <Image src={data?.posterUrl} loaded={poster.loaded} alt="poster" borderRadius="12px" />
          </span>
          <span>
            <MediaHeaderInfo>
              <MediaHeaderTags>
                <MediaTag media={data} />
                {data?.status && <Tag>{data?.status}</Tag>}
                {data?.mediaServersInfo && data?.mediaServersInfo.length > 0 && (
                  <SuccessTag>Available</SuccessTag>
                )}
              </MediaHeaderTags>
              <br />
              <MediaHeaderTitle>
                {data?.title + ' '}
                {data?.releaseDate && (
                  <span className="media-title-release-date">({data?.releaseDate})</span>
                )}
              </MediaHeaderTitle>
              <MediaHeaderSubInfo>
                {data?.releaseDate && (
                  <>
                    <p>{data?.releaseDate}</p>
                    {(data?.duration || data?.genres) && <p className="pipe-separator">|</p>}
                  </>
                )}
                {data?.duration && (
                  <>
                    <p>{minToHoursMinutes(data?.duration)}</p>
                    {data?.genres && <p className="pipe-separator">|</p>}
                  </>
                )}
                <p>
                  {data?.genres &&
                    data?.genres.map((genre, index) => (
                      <span key={index}>
                        {genre.name}
                        {data?.genres && index !== data?.genres.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                </p>
              </MediaHeaderSubInfo>
              <br />
              <Row alignItems="center" wrap="nowrap">
                <Row alignItems="center" wrap="nowrap">
                  <MediaRating data={data} />
                  {data?.trailers && data?.trailers.length > 0 && (
                    <Buttons>
                      <PrimaryLinkButton
                        href={data?.trailers[0].videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="left-icon">
                          <Icon icon={faFilm} />
                        </span>
                        Watch trailer
                      </PrimaryLinkButton>
                    </Buttons>
                  )}
                </Row>
                <Row justifyContent="flex-end" alignItems="center" wrap="nowrap">
                  <Buttons>
                    {((isMovie(data) && !isOnServers(data)) || isSeries(data)) && (
                      <RequestButton media={data} />
                    )}
                    {data?.mediaServersInfo &&
                      data?.mediaServersInfo.length > 0 &&
                      data?.mediaServersInfo[0].webUrl && (
                        <PlayButton webUrl={data?.mediaServersInfo[0].webUrl} />
                      )}
                  </Buttons>
                </Row>
              </Row>
            </MediaHeaderInfo>
          </span>
        </MediaHeader>
        {data?.summary && (
          <>
            <H2>Overview</H2>
            <p>{data?.summary}</p>
          </>
        )}
      </BackgroundContainer>
      <MediaCrewInfo>
        {studio && (
          <Bubble>
            <H2>Studio</H2>
            <p>{studio}</p>
          </Bubble>
        )}
        {directors && directors.length > 0 && (
          <Bubble>
            <H2>Directors</H2>
            {directors.map((name, index) => (
              <p key={index}>{name}</p>
            ))}
          </Bubble>
        )}
        {producers && producers.length > 0 && (
          <Bubble>
            <H2>Producers</H2>
            {producers.map((name, index) => (
              <p key={index}>{name}</p>
            ))}
          </Bubble>
        )}

        {screenplay && screenplay.length > 0 && (
          <Bubble>
            <H2>Screenplay</H2>
            {screenplay.map((name, index) => (
              <p key={index}>{name}</p>
            ))}
          </Bubble>
        )}
      </MediaCrewInfo>

      {data?.credits && data?.credits.cast && data?.credits.cast.length > 0 && (
        <>
          <PrimaryDivider />
          <MediaPersonCarousel title="Actors" personList={data?.credits.cast} />
        </>
      )}

      <PrimaryDivider />

      {isMovie(data) && <RecommendedMoviesSlider id={data?.tmdbId} />}

      {isSeries(data) && <RecommendedSeriesSlider id={data?.tmdbId} />}

      <PrimaryDivider />

      {isMovie(data) && <SimilarMoviesSlider id={data?.tmdbId} />}
      {isSeries(data) && <SimilarSeriesSlider id={data?.tmdbId} />}
    </span>
  )
}
