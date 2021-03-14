import React, { useState } from "react";
import { FriendsProvidersDropdown } from "./FriendsProvidersDropdown";
import { Spinner } from "../Spinner";
import { ComponentSizes } from "../../enums/ComponentSizes";
import { useFriendsSeriesProviders } from "../../hooks/useFriendsSeriesProviders";
import { InputField } from "../inputs/InputField";
import { RequestSeriesOptions } from "../../enums/RequestSeriesOptions";
import { SeriesRequestSeasonsList } from "./SeriesRequestSeasonsList";
import { ISeries } from "../../models/IMedia";
import { SeriesRequestOptionsPreview } from "./SeriesRequestOptionsPreview";
import { PrimaryLightDivider } from "../Divider";

type RequestSeriesCardProps = {
  series: ISeries;
};

export const RequestSeriesCard = (props: RequestSeriesCardProps) => {
  const friendsSeriesProviders = useFriendsSeriesProviders();
  const [seriesRequestScopeOptions, setSeriesRequestScopeOptions] = useState(
    RequestSeriesOptions.ALL
  );

  return (
    <div>
      {friendsSeriesProviders.isLoading && (
        <Spinner size={ComponentSizes.LARGE} />
      )}
      {!friendsSeriesProviders.isLoading &&
        friendsSeriesProviders.data &&
        friendsSeriesProviders.data?.length === 0 && (
          <p>You have no friend to request</p>
        )}
      {!friendsSeriesProviders.isLoading &&
        friendsSeriesProviders.data &&
        friendsSeriesProviders.data?.length > 0 && (
          <>
            <FriendsProvidersDropdown users={friendsSeriesProviders.data} />
            <InputField isInline>
              <label>Request : </label>
              <select
                onChange={(e) =>
                  setSeriesRequestScopeOptions(
                    e.target.value as RequestSeriesOptions
                  )
                }
              >
                <option value={RequestSeriesOptions.ALL}>
                  {RequestSeriesOptions.ALL}
                </option>
                <option value={RequestSeriesOptions.SELECT}>
                  {RequestSeriesOptions.SELECT}
                </option>
              </select>
            </InputField>
            {seriesRequestScopeOptions === RequestSeriesOptions.SELECT && (
              <div>
                <PrimaryLightDivider />
                <SeriesRequestOptionsPreview />
                <PrimaryLightDivider />
                <SeriesRequestSeasonsList series={props.series} />
              </div>
            )}
          </>
        )}
    </div>
  );
};
