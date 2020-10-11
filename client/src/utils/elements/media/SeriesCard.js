import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { usePlex } from "../../../modules/providers/plex/hooks/usePlex";
import { ColumnLayout, RowLayout } from "../layouts";
import { Tag, TagColor } from "../Tag";
import { Link } from "react-router-dom";
import { routes } from "../../../router/routes";
import { Actors } from "./Actors";
import { Image } from "../Image";
import { MediaTitle } from "./MediaTitle";
import { Container } from "../Container";
import { PlexButton } from "../PlexButton";
import { MediaRating } from "./MediaRating";
import { MediaBackground } from "./MediaBackground";
import { Spinner } from "../Spinner";

const SeriesCard = ({ series }) => {
  const { id } = useParams();
  const [seriesInfo, setSeriesInfo] = useState(null);
  const { getSeries } = usePlex();

  useEffect(() => {
    if (!series) {
      getSeries(id).then((s) => {
        if (s) setSeriesInfo(s);
      });
    } else {
      setSeriesInfo(series);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!seriesInfo || seriesInfo.id !== id)
    return <Spinner color="primary" size="2x" />;

  return (
    <MediaBackground image={seriesInfo.artUrl}>
      <Container padding="1%">
        <RowLayout alignItems="flex-start">
          <Image
            src={seriesInfo.thumbUrl}
            alt={seriesInfo.title}
            width="16%"
            borderRadius="12px"
          />
          <Container paddingRight="1%" paddingLeft="1%">
            <MediaTitle media={seriesInfo} />
            <RowLayout childPaddingRight="1em">
              {seriesInfo.releaseDate && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Released"
                >
                  {seriesInfo.releaseDate}
                </p>
              )}
              {seriesInfo.releaseDate && <p className="is-size-7">•</p>}
              {seriesInfo.contentRating && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Content rating"
                >
                  {seriesInfo.contentRating}
                </p>
              )}
            </RowLayout>
            {!seriesInfo.isWatched && (
              <RowLayout marginTop="1em">
                <Tag type={TagColor.DARK}>Unplayed</Tag>
              </RowLayout>
            )}
            <RowLayout
              marginTop="1em"
              childMarginRight="1em"
              alignItems="center"
            >
              {seriesInfo.rating && <MediaRating media={seriesInfo} />}
              <PlexButton
                onClick={() => window.open(seriesInfo.webUrl)}
                text="Open in plex"
              />
            </RowLayout>
            {seriesInfo.summary && (
              <RowLayout marginTop="1em">
                <div>
                  <div className="is-size-5">Overview</div>
                  <div className="is-size-6">{seriesInfo.summary}</div>
                </div>
              </RowLayout>
            )}
            <RowLayout
              marginTop="1em"
              childMarginRight="2%"
              alignItems="flex-start"
            >
              {seriesInfo.studio && (
                <div>
                  <div className="is-size-6">Studio</div>
                  <div className="is-size-7">{seriesInfo.studio}</div>
                </div>
              )}
              {seriesInfo.genres && seriesInfo.genres.length > 0 && (
                <ColumnLayout width="50%">
                  <div className="is-size-6">Genres</div>
                  <RowLayout childMarginRight="1em">
                    {seriesInfo.genres.map((genre, index) => (
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
          {seriesInfo.seasons.map((season, index) => (
            <Link
              key={index}
              to={routes.SEASON.url(season.seriesId, season.id)}
            >
              <ColumnLayout alignItems="center">
                <Image
                  src={season.thumbUrl}
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
        <Actors actors={seriesInfo.actors} />
      </Container>
    </MediaBackground>
  );
};

export { SeriesCard };
