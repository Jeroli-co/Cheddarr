import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ColumnLayout, RowLayout } from "../layouts";
import { Tag, TagColor } from "../Tag";
import { Actors } from "./Actors";
import { Image } from "../Image";
import { MediaTitle } from "./MediaTitle";
import { Container } from "../Container";
import { PlexButton } from "../PlexButton";
import { MediaRating } from "./MediaRating";
import { MediaBackground } from "./MediaBackground";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { STATIC_STYLES } from "../../../enums/StaticStyles";
import Spinner from "../Spinner";
import { IMediaServerMovie } from "../../../models/IMediaServerMedia";
import { PlexService } from "../../../services/PlexService";

type MovieCardProps = {
  movie: IMediaServerMovie | null;
};

type MovieCardParams = {
  id: string;
};

const MovieCard = ({ movie }: MovieCardProps) => {
  const { id } = useParams<MovieCardParams>();
  const [movieInfo, setMovieInfo] = useState<IMediaServerMovie | null>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (!movie) {
      PlexService.GetPlexMovie(parseInt(id, 10)).then((res) => {
        if (res.error === null) setMovieInfo(res.data);
      });
    } else {
      setMovieInfo(movie);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!movieInfo || (!movie && movieInfo.id !== parseInt(id, 10)))
    return <Spinner color="primary" size="2x" />;

  return (
    <MediaBackground image={movieInfo.artUrl}>
      <Container padding="1%">
        <RowLayout alignItems="flex-start">
          <Image
            src={movieInfo.posterUrl}
            alt={movieInfo.title}
            width="16%"
            borderRadius="12px"
          />

          <Container paddingRight="1%" paddingLeft="1%">
            <MediaTitle media={movieInfo} />
            <RowLayout childPaddingRight="1em">
              {movieInfo.releaseDate && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Released"
                >
                  {movieInfo.releaseDate}
                </p>
              )}
              {movieInfo.releaseDate && <p className="is-size-7">•</p>}
              {movieInfo.contentRating && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Content rating"
                >
                  {movieInfo.contentRating}
                </p>
              )}
              {movieInfo.contentRating && <p className="is-size-7">•</p>}
              {movieInfo.duration && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Content rating"
                >
                  {movieInfo.duration}
                </p>
              )}
            </RowLayout>

            {!movieInfo.isWatched && (
              <RowLayout marginTop="1em">
                <Tag type={TagColor.DARK}>Unplayed</Tag>
              </RowLayout>
            )}

            <RowLayout marginTop="1em" childMarginRight="1em">
              <MediaRating media={movieInfo} />
              <PlexButton
                onClick={() => window.open(movieInfo.webUrl[0])}
                text="Open in plex"
              />
            </RowLayout>

            {width > STATIC_STYLES.TABLET_MAX_WIDTH && (
              <div>
                {movieInfo.summary && (
                  <RowLayout marginTop="1em">
                    <div>
                      <div className="is-size-5">Overview</div>
                      <div className="is-size-6">{movieInfo.summary}</div>
                    </div>
                  </RowLayout>
                )}

                <RowLayout
                  marginTop="1em"
                  childMarginRight="2%"
                  alignItems="flex-start"
                >
                  {movieInfo.directors && movieInfo.directors.length > 0 && (
                    <div>
                      <div className="is-size-6">Directed</div>
                      {movieInfo.directors.map((director, index) => (
                        <div className="is-size-7" key={index}>
                          {director +
                            (index + 1 === movieInfo.directors.length
                              ? ""
                              : ", ")}
                        </div>
                      ))}
                    </div>
                  )}
                  {movieInfo.studio && (
                    <div>
                      <div className="is-size-6">Studio</div>
                      <div className="is-size-7">{movieInfo.studio}</div>
                    </div>
                  )}
                  {movieInfo.genres && movieInfo.genres.length > 0 && (
                    <ColumnLayout width="50%">
                      <div className="is-size-6">Genres</div>
                      <RowLayout childMarginRight="1em">
                        {movieInfo.id === parseInt(id, 10) &&
                          movieInfo.genres.map((genre, index) => (
                            <Tag key={index} type={TagColor.INFO}>
                              {genre}
                            </Tag>
                          ))}
                      </RowLayout>
                    </ColumnLayout>
                  )}
                </RowLayout>
              </div>
            )}
          </Container>
        </RowLayout>

        {width <= STATIC_STYLES.TABLET_MAX_WIDTH && (
          <div>
            {movieInfo.summary && (
              <RowLayout marginTop="1em">
                <div>
                  <div className="is-size-5">Overview</div>
                  <div className="is-size-6">{movieInfo.summary}</div>
                </div>
              </RowLayout>
            )}

            <RowLayout
              marginTop="1em"
              childMarginRight="2%"
              alignItems="flex-start"
            >
              {movieInfo.directors && movieInfo.directors.length > 0 && (
                <div>
                  <div className="is-size-6">Directed</div>
                  {movieInfo.directors.map((director, index) => (
                    <div className="is-size-7" key={index}>
                      {director +
                        (index + 1 === movieInfo.directors.length ? "" : ", ")}
                    </div>
                  ))}
                </div>
              )}
              {movieInfo.studio && (
                <div>
                  <div className="is-size-6">Studio</div>
                  <div className="is-size-7">{movieInfo.studio}</div>
                </div>
              )}
              {movieInfo.genres && movieInfo.genres.length > 0 && (
                <ColumnLayout width="50%">
                  <div className="is-size-6">Genres</div>
                  <RowLayout childMarginRight="1em">
                    {movieInfo.id === parseInt(id, 10) &&
                      movieInfo.genres.map((genre, index) => (
                        <Tag key={index} type={TagColor.INFO}>
                          {genre}
                        </Tag>
                      ))}
                  </RowLayout>
                </ColumnLayout>
              )}
            </RowLayout>
          </div>
        )}

        <hr />

        <Actors actors={movieInfo.actors} />
      </Container>
    </MediaBackground>
  );
};

export { MovieCard };
