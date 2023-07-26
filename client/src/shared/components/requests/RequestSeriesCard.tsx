import React, { useState } from "react";
import { Input } from "../../../elements/Input";
import { RequestSeriesOptions } from "../../enums/RequestSeriesOptions";
import { SeriesRequestSeasonsList } from "./SeriesRequestSeasonsList";
import { ISeries } from "../../models/IMedia";
import { SeriesRequestOptionsPreview } from "./SeriesRequestOptionsPreview";
import { PrimaryLightDivider } from "../Divider";

type RequestSeriesCardProps = {
  series: ISeries;
};

export const RequestSeriesCard = (props: RequestSeriesCardProps) => {
  const [seriesRequestScopeOptions, setSeriesRequestScopeOptions] = useState(
    RequestSeriesOptions.ALL,
  );

  return (
    <div>
      <Input isInline>
        <label>Request : </label>
        <select
          onChange={(e) =>
            setSeriesRequestScopeOptions(e.target.value as RequestSeriesOptions)
          }
        >
          <option value={RequestSeriesOptions.ALL}>
            {RequestSeriesOptions.ALL}
          </option>
          <option value={RequestSeriesOptions.SELECT}>
            {RequestSeriesOptions.SELECT}
          </option>
        </select>
      </Input>
      {seriesRequestScopeOptions === RequestSeriesOptions.SELECT && (
        <div>
          <PrimaryLightDivider />
          <SeriesRequestOptionsPreview />
          <PrimaryLightDivider />
          <SeriesRequestSeasonsList series={props.series} />
        </div>
      )}
    </div>
  );
};
