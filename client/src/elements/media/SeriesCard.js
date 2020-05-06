import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { usePlex } from "../../hooks/usePlex";
import { Spinner } from "../Spinner";
import { ColumnLayout, RowLayout } from "../layouts";
import { Tag, TagColor } from "../Tag";
import { Link } from "react-router-dom";
import { routes } from "../../router/routes";
import { Actors } from "../../widgets/media-recently-added/elements/Actors";
import { Image } from "../Image";
import { LineBulletList } from "./LineBulletList";
import { MediaTitle } from "./MediaTitle";
import { Container } from "../Container";
import { PlexButton } from "../PlexButton";
import { MediaRating } from "./MediaRating";
import { MediaBackground } from "./MediaBackground";

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
    return (
      <Spinner
        justifyContent="center"
        alignItems="center"
        height="500px"
        color="primary"
        size="2x"
      />
    );

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
            <LineBulletList>
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Released"
              >
                {seriesInfo.releaseDate}
              </p>
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Content rating"
              >
                {seriesInfo.contentRating}
              </p>
            </LineBulletList>
            {!seriesInfo.isWatched && (
              <RowLayout marginTop="1em">
                <Tag type={TagColor.DARK} content="Unplayed" />
              </RowLayout>
            )}
            <RowLayout marginTop="1em" childMarginRight="1em">
              <MediaRating media={seriesInfo} />
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
          </Container>
        </RowLayout>
        <hr />
        <div className="is-size-5">Seasons</div>
        <RowLayout childMarginRight="1em" wrap="wrap">
          {seriesInfo.seasons.map((season) => (
            <Link to={routes.SEASON.url(season.seriesId, season.seasonNumber)}>
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
