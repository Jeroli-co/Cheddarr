import { useState } from 'react'
import { SeriesRequestEpisodesList } from './SeriesRequestEpisodesList'
import { faAngleDown, faAngleRight, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { PrimaryLightDivider } from '../Divider'
import { Spinner } from '../Spinner'
import { ComponentSizes } from '../../enums/ComponentSizes'
import { ISeries } from '../../models/IMedia'
import { OutlinePrimaryIconButton, PrimaryIconButton } from '../Button'
import { Icon } from '../Icon'
import { useSeriesRequestOptionsContext } from '../../contexts/SeriesRequestOptionsContext'
import { ClosableTitle } from '../ClosableTitle'
import { Row } from '../layout/Row'
import { Buttons } from '../layout/Buttons'
import { useSeries } from '../../../hooks/useMedia'

type SeriesRequestSeasonsListProps = {
  series: ISeries
}

const SeriesRequestSeasonsList = (props: SeriesRequestSeasonsListProps) => {
  const { data, isLoading } = useSeries(props.series.tmdbId)

  const [seasonNumberSelected, setSeasonNumberSelected] = useState<number | null>(null)

  const { addSeason, removeSeason, isSeasonSelected } = useSeriesRequestOptionsContext()

  if (isLoading) {
    return <Spinner size={ComponentSizes.LARGE} />
  }

  return (
    <>
      {data?.seasons?.map((season) => (
        <div key={season.seasonNumber}>
          <Row alignItems="center" wrap="nowrap">
            <Buttons>
              {isSeasonSelected(season.seasonNumber) && (
                <OutlinePrimaryIconButton
                  type="button"
                  onClick={() => removeSeason(season.seasonNumber)}
                >
                  <Icon icon={faMinus} />
                </OutlinePrimaryIconButton>
              )}
              {!isSeasonSelected(season.seasonNumber) && (
                <PrimaryIconButton type="button" onClick={() => addSeason(season.seasonNumber)}>
                  <Icon icon={faPlus} />
                </PrimaryIconButton>
              )}
            </Buttons>
            <ClosableTitle
              onClick={() =>
                setSeasonNumberSelected(
                  seasonNumberSelected !== season.seasonNumber ? season.seasonNumber : null
                )
              }
            >
              <p>Season {season.seasonNumber}</p>

              {(seasonNumberSelected !== null && season.seasonNumber === seasonNumberSelected && (
                <Icon icon={faAngleDown} size="lg" />
              )) || <Icon icon={faAngleRight} size="lg" />}
            </ClosableTitle>
          </Row>
          {seasonNumberSelected !== null && season.seasonNumber === seasonNumberSelected && (
            <>
              <PrimaryLightDivider />
              <SeriesRequestEpisodesList
                seriesId={props.series.tmdbId}
                seasonNumber={seasonNumberSelected}
              />
            </>
          )}
          <PrimaryLightDivider />
        </div>
      ))}
    </>
  )
}

export { SeriesRequestSeasonsList }
