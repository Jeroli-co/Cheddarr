import React, { useEffect, useState } from "react";
import { Container } from "../../../utils/elements/Container";
import { RowLayout } from "../../../utils/elements/layouts";
import { Image } from "../../../utils/elements/Image";
import { MediaRating } from "../../../utils/elements/media/MediaRating";
import { ProvidersDropdown } from "./ProvidersDropdown";
import { MediaRequestButton } from "./MediaRequestButton";
import { SeasonsMenu } from "./SeasonsMenu";
import { RequestSeriesOptions } from "../../requests/enums/RequestSeriesOptions";
import { useRequestSeriesOptions } from "../../requests/hooks/useRequestSeriesOptions";
import { ISearchedSeries } from "../models/ISearchedMedias";
import { IPublicUser } from "../../user/models/IPublicUser";
import { MediasTypes } from "../../media/enums/MediasTypes";

type SearchedSeriesCardProps = {
  series: ISearchedSeries;
  friendsProviders: IPublicUser[];
};

const SearchedSeriesCard = ({
  series,
  friendsProviders,
}: SearchedSeriesCardProps) => {
  const [providerSelected, setProviderSelected] = useState<IPublicUser | null>(
    null
  );
  const {
    options,
    addSeasons,
    removeSeasons,
    addEpisode,
    removeEpisode,
    isSeasonSelected,
    isEpisodeSelected,
  } = useRequestSeriesOptions(series);
  const [showSeasons, setShowSeasons] = useState(false);

  useEffect(() => {
    if (friendsProviders.length > 0) {
      setProviderSelected(friendsProviders[0]);
    }
  }, [friendsProviders]);

  const handleProviderChanges = (provider: IPublicUser) => {
    setProviderSelected(provider);
  };

  const handleSeriesScopeChanges = (options: string) => {
    if (options === RequestSeriesOptions.ALL) setShowSeasons(false);
    if (options === RequestSeriesOptions.SELECT) setShowSeasons(true);
  };

  const handleAddSeason = (seasonNumber: number) => {
    addSeasons(seasonNumber);
  };

  const handleRemoveSeason = (seasonNumber: number) => {
    removeSeasons(seasonNumber);
  };

  const handleAddEpisode = (seasonNumber: number, episodeNumber: number) => {
    addEpisode(seasonNumber, episodeNumber);
  };

  const handleRemoveEpisode = (seasonNumber: number, episodeNumber: number) => {
    removeEpisode(seasonNumber, episodeNumber);
  };

  return (
    <Container
      padding="1%"
      margin="1%"
      border="1px solid black"
      borderRadius="12px"
    >
      <RowLayout alignItems="flex-start">
        <Image
          src={series.thumbUrl}
          alt={series.title}
          width="12%"
          borderRadius="12px"
        />
        <Container width="100%" padding="1%">
          <RowLayout justifyContent="space-between" alignItems="center">
            <h1 className="title is-3">{series.title}</h1>
            <ProvidersDropdown
              providers={friendsProviders}
              handleChanges={handleProviderChanges}
            />
            {providerSelected && options && (
              <MediaRequestButton
                mediasType={MediasTypes.SERIES}
                requestCreate={{
                  tvdbId: series.tvdbId,
                  requestedUsername: providerSelected.username,
                  seasons: options.seasons,
                }}
                onSeriesScopeChanges={handleSeriesScopeChanges}
              />
            )}
            <MediaRating media={series} />
          </RowLayout>
          <div>
            {series.releaseDate && (
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Released"
              >
                {series.releaseDate}
              </p>
            )}
          </div>
          {series.summary && (
            <RowLayout marginTop="1em">
              <div>
                <div className="is-size-5">Overview</div>
                <div className="is-size-6">{series.summary}</div>
              </div>
            </RowLayout>
          )}
        </Container>
      </RowLayout>
      {showSeasons && (
        <div>
          <div className="is-divider" />
          <SeasonsMenu
            series={series}
            handleAddSeason={handleAddSeason}
            handleAddEpisode={handleAddEpisode}
            handleRemoveSeason={handleRemoveSeason}
            handleRemoveEpisode={handleRemoveEpisode}
            isSeasonSelected={isSeasonSelected}
            isEpisodeSelected={isEpisodeSelected}
          />
        </div>
      )}
    </Container>
  );
};

export { SearchedSeriesCard };
