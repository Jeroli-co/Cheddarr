import { useState } from 'react'
import { RequestSeriesOptions } from '../../enums/RequestSeriesOptions'
import { SeriesRequestSeasonsList } from './SeriesRequestSeasonsList'
import { ISeries } from '../../models/IMedia'
import { SeriesRequestOptionsPreview } from './SeriesRequestOptionsPreview'
import { PrimaryLightDivider } from '../Divider'
import { z } from 'zod'

const requestSeriesOptionsScheme = z.object({
  scopeOptions: z.enum([RequestSeriesOptions.ALL, RequestSeriesOptions.SELECT]),
})

type RequestSeriesOptionsFormData = z.infer<typeof requestSeriesOptionsScheme>

type RequestSeriesCardProps = {
  series: ISeries
}

export const RequestSeriesCard = (props: RequestSeriesCardProps) => {
  const [seriesRequestScopeOptions, setSeriesRequestScopeOptions] =
    useState<RequestSeriesOptionsFormData>({ scopeOptions: RequestSeriesOptions.ALL })

  return (
    <div>
      <div>
        <label>Request : </label>
        <select
          onChange={(e) =>
            setSeriesRequestScopeOptions({ scopeOptions: e.target.value as RequestSeriesOptions })
          }
        >
          <option value={RequestSeriesOptions.ALL}>{RequestSeriesOptions.ALL}</option>
          <option value={RequestSeriesOptions.SELECT}>{RequestSeriesOptions.SELECT}</option>
        </select>
      </div>

      {seriesRequestScopeOptions.scopeOptions === RequestSeriesOptions.SELECT && (
        <div>
          <PrimaryLightDivider />
          <SeriesRequestOptionsPreview />
          <PrimaryLightDivider />
          <SeriesRequestSeasonsList series={props.series} />
        </div>
      )}
    </div>
  )
}
