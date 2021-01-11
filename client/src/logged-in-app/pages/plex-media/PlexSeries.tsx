import React from "react";
import { useParams } from "react-router";
import { ColumnLayout, RowLayout } from "../../../shared/components/Layouts";
import { Tag, TagColor } from "./components/Tag";
import { Link } from "react-router-dom";
import { routes } from "../../../router/routes";
import { Actors } from "./components/Actors";
import { Image } from "../../../shared/components/Image";
import { MediaTitle } from "./components/MediaTitle";
import { Container } from "../../../shared/components/Container";
import { PlexButton } from "../../../shared/components/PlexButton";
import { MediaRating } from "./components/MediaRating";
import { MediaBackground } from "./components/MediaBackground";
import Spinner from "../../../shared/components/Spinner";
import { usePlexSeries } from "../../hooks/usePlexSeries";
import { SwitchErrors } from "../../../shared/components/errors/SwitchErrors";

type SeriesCardParams = {
  id: string;
};

const PlexSeries = () => {
  const { id } = useParams<SeriesCardParams>();
  const series = usePlexSeries(id);

  if (series.isLoading) return <Spinner color="primary" size="2x" />;

  if (!series.data) {
    return <SwitchErrors status={series.status} />;
  }

  return (
    <MediaBackground image={series.data.artUrl}>
      <Container padding="1%">
        <RowLayout alignItems="flex-start">
          <Image
            src={series.data.posterUrl}
            alt={series.data.title}
            width="16%"
            borderRadius="12px"
          />
          <Container paddingRight="1%" paddingLeft="1%">
            <MediaTitle media={series.data} />
            <RowLayout childPaddingRight="1em">
              {series.data.releaseDate && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Released"
                >
                  {series.data.releaseDate}
                </p>
              )}
            </RowLayout>
            {!series.data.isWatched && (
              <RowLayout marginTop="1em">
                <Tag type={TagColor.DARK}>Unplayed</Tag>
              </RowLayout>
            )}
            <RowLayout
              marginTop="1em"
              childMarginRight="1em"
              alignItems="center"
            >
              {series.data.rating && <MediaRating media={series.data} />}
              {series.data?.webUrl && series.data?.webUrl.length > 0 && (
                <PlexButton
                  onClick={() =>
                    series.data?.webUrl
                      ? window.open(series.data.webUrl[0])
                      : {}
                  }
                  text="Open in plex"
                />
              )}
            </RowLayout>
            {series.data.summary && (
              <RowLayout marginTop="1em">
                <div>
                  <div className="is-size-5">Overview</div>
                  <div className="is-size-6">{series.data.summary}</div>
                </div>
              </RowLayout>
            )}
            <RowLayout
              marginTop="1em"
              childMarginRight="2%"
              alignItems="flex-start"
            >
              <div className="is-size-6">Studio</div>
              {series.data.studios &&
                series.data.studios.length > 0 &&
                series.data.studios.map((studio, index) => (
                  <div key={index}>
                    <div className="is-size-7">{studio.name}</div>
                  </div>
                ))}
              {series.data.genres && series.data.genres.length > 0 && (
                <ColumnLayout width="50%">
                  <div className="is-size-6">Genres</div>
                  <RowLayout childMarginRight="1em">
                    {series.data.genres.map((genre, index) => (
                      <Tag key={index} type={TagColor.INFO}>
                        {genre.name}
                      </Tag>
                    ))}
                  </RowLayout>
                </ColumnLayout>
              )}
            </RowLayout>
          </Container>
        </RowLayout>
        <hr />
        <RowLayout marginBottom="1em">
          <div className="is-size-4">Seasons</div>
        </RowLayout>
        <RowLayout childMarginRight="1em" wrap="wrap">
          {series.data.seasons.map((season, index) => (
            <Link key={index} to={routes.SEASON.url(season.id.toString())}>
              <ColumnLayout alignItems="center">
                <Image
                  src={season.posterUrl}
                  alt={season.title}
                  width="125px"
                  borderRadius="12px"
                />
                <p>{"Season " + season.seasonNumber}</p>
              </ColumnLayout>
            </Link>
          ))}
        </RowLayout>
        <hr />
        <Actors actors={series.data.actors} />
      </Container>
    </MediaBackground>
  );
};

export { PlexSeries };
