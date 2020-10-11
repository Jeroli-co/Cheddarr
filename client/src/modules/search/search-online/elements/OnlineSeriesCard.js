import React, { useEffect, useState } from "react";
import { Container } from "../../../../utils/elements/Container";
import { RowLayout } from "../../../../utils/elements/layouts";
import { Image } from "../../../../utils/elements/Image";
import { MediaRating } from "../../../../utils/elements/media/MediaRating";
import { ProvidersDropdown } from "./ProvidersDropdown";
import { MediaRequestButton } from "./MediaRequestButton";
import { MEDIA_TYPES } from "../../../media/enums/MediaTypes";
import { SeasonsMenu } from "./SeasonsMenu";
import { REQUEST_SERIES_OPTIONS } from "../../../requests/enums/RequestSeriesOptions";
import { useMedia } from "../../../media/hooks/useMedia";
import { useRequestSeriesOptions } from "../../../requests/hooks/useRequestSeriesOptions";

const OnlineSeriesCard = ({ media, friendsProviders }) => {
  const [providerSelected, setProviderSelected] = useState(null);
  const series = useMedia(MEDIA_TYPES.SERIES, media.tvdb_id);
  const [requestScope, setRequestScope] = useState(REQUEST_SERIES_OPTIONS.ALL);
  const [defaultRequest, setDefaultRequest] = useState(null);
  const {
    request,
    addSeasons,
    removeSeasons,
    addEpisode,
    removeEpisode,
    isSeasonSelected,
    isEpisodeSelected,
  } = useRequestSeriesOptions(series.data);

  useEffect(() => {
    if (friendsProviders.length > 0) {
      setProviderSelected(friendsProviders[0]);
    }
  }, [friendsProviders]);

  useEffect(() => {
    if (series.isLoaded && series.data !== null && providerSelected) {
      setDefaultRequest({
        tvdb_id: series.data.tvdb_id,
        requested_username: providerSelected.username,
        series_type: series.data.series_type,
        seasons: series.data.seasons,
      });
    }
  }, [series, providerSelected]);

  const handleProviderChanges = (event) => {
    setProviderSelected(event.target.value);
    event.preventDefault();
  };

  const handleSeriesScopeChanges = (e) => {
    if (e.target.value === REQUEST_SERIES_OPTIONS.ALL)
      setRequestScope(REQUEST_SERIES_OPTIONS.ALL);
    if (e.target.value === REQUEST_SERIES_OPTIONS.SELECT)
      setRequestScope(REQUEST_SERIES_OPTIONS.SELECT);
    e.preventDefault();
  };

  const handleAddSeason = (season_number) => {
    addSeasons(season_number);
  };

  const handleRemoveSeason = (season_number) => {
    removeSeasons(season_number);
  };

  const handleAddEpisode = (season_number, episode_number) => {
    addEpisode(season_number, episode_number);
  };

  const handleRemoveEpisode = (season_number, episode_number) => {
    removeEpisode(season_number, episode_number);
  };

  const getRequestBody = () => {
    switch (requestScope) {
      case REQUEST_SERIES_OPTIONS.ALL:
        return defaultRequest;
      case REQUEST_SERIES_OPTIONS.SELECT:
        return request;
      default:
        console.log("No scope matched");
        return null;
    }
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
          src={media["thumbUrl"]}
          alt={media.title}
          width="12%"
          borderRadius="12px"
        />
        <Container width="100%" padding="1%">
          <RowLayout justifyContent="space-between" alignItems="center">
            <h1 className="title is-3">{media.title}</h1>
            <ProvidersDropdown
              providers={friendsProviders}
              handleChange={handleProviderChanges}
            />
            {providerSelected && request && (
              <MediaRequestButton
                requested_username={providerSelected.username}
                media_type={MEDIA_TYPES.SERIES}
                request_body={getRequestBody()}
                onSeriesScopeChanges={handleSeriesScopeChanges}
              />
            )}
            <MediaRating media={media} />
          </RowLayout>
          <div>
            {media["releaseDate"] && (
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Released"
              >
                {media["releaseDate"]}
              </p>
            )}
          </div>
          {media.summary && (
            <RowLayout marginTop="1em">
              <div>
                <div className="is-size-5">Overview</div>
                <div className="is-size-6">{media.summary}</div>
              </div>
            </RowLayout>
          )}
        </Container>
      </RowLayout>
      {requestScope === REQUEST_SERIES_OPTIONS.SELECT && (
        <div>
          <div className="is-divider" />
          <SeasonsMenu
            series={series.data}
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

export { OnlineSeriesCard };
