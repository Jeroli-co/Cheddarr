import React from "react";
import { useParams } from "react-router";
import {
  ColumnLayout,
  RowLayout,
} from "../../../shared/components/layout/Layouts";
import { Tag, TagColor } from "./components/Tag";
import { Actors } from "./components/Actors";
import { Image } from "../../../shared/components/Image";
import { MediaTitle } from "./components/MediaTitle";
import { Container } from "../../../shared/components/layout/Container";
import { PlexButton } from "../../../shared/components/PlexButton";
import { MediaRating } from "./components/MediaRating";
import { MediaBackground } from "./components/MediaBackground";
import { useWindowSize } from "../../../shared/hooks/useWindowSize";
import { STATIC_STYLES } from "../../../shared/enums/StaticStyles";
import Spinner from "../../../shared/components/Spinner";
import { usePlexMovie } from "../../hooks/usePlexMovie";
import { SwitchErrors } from "../../../shared/components/errors/SwitchErrors";

type MovieCardParams = {
  id: string;
};

const PlexMovie = () => {
  const { id } = useParams<MovieCardParams>();
  const movie = usePlexMovie(id);
  const { width } = useWindowSize();

  const openInPlex = () => {
    if (movie.data && movie.data.webUrl && movie.data.webUrl.length > 0) {
      window.open(movie.data.webUrl[0]);
    }
  };

  if (movie.isLoading) {
    return <Spinner color="primary" size="2x" />;
  }

  if (movie.data === null) {
    return <SwitchErrors status={movie.status} />;
  }

  return (
    <MediaBackground image={movie.data.artUrl}>
      <Container padding="1%">
        <RowLayout alignItems="flex-start">
          <Image
            src={movie.data.posterUrl}
            alt={movie.data.title}
            width="16%"
            borderRadius="12px"
          />

          <Container paddingRight="1%" paddingLeft="1%">
            <MediaTitle media={movie.data} />
            <RowLayout childPaddingRight="1em">
              {movie.data.releaseDate && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Released"
                >
                  {movie.data.releaseDate}
                </p>
              )}
              {movie.data.releaseDate && <p className="is-size-7">•</p>}
              {movie.data.duration && (
                <p
                  className="is-size-7"
                  style={{ cursor: "default" }}
                  data-tooltip="Content rating"
                >
                  {movie.data.duration}
                </p>
              )}
            </RowLayout>

            {!movie.data.isWatched && (
              <RowLayout marginTop="1em">
                <Tag type={TagColor.DARK}>Unplayed</Tag>
              </RowLayout>
            )}

            <RowLayout marginTop="1em" childMarginRight="1em">
              <MediaRating media={movie.data} />
              {movie.data &&
                movie.data.webUrl &&
                movie.data.webUrl.length > 0 && (
                  <PlexButton
                    onClick={() => openInPlex()}
                    text="Open in plex"
                  />
                )}
            </RowLayout>

            {width > STATIC_STYLES.TABLET_MAX_WIDTH && (
              <div>
                {movie.data.summary && (
                  <RowLayout marginTop="1em">
                    <div>
                      <div className="is-size-5">Overview</div>
                      <div className="is-size-6">{movie.data.summary}</div>
                    </div>
                  </RowLayout>
                )}

                <RowLayout
                  marginTop="1em"
                  childMarginRight="2%"
                  alignItems="flex-start"
                >
                  {movie.data.directors && movie.data.directors.length > 0 && (
                    <div>
                      <div className="is-size-6">Directed</div>
                      {movie.data.directors.map((director, index) => (
                        <div className="is-size-7" key={index}>
                          {director.name +
                            (movie.data &&
                            index + 1 === movie.data.directors.length
                              ? ""
                              : ", ")}
                        </div>
                      ))}
                    </div>
                  )}
                  {movie.data.studio && (
                    <div>
                      <div className="is-size-6">Studio</div>
                      <div className="is-size-7">{movie.data.studio}</div>
                    </div>
                  )}
                  {movie.data.genres && movie.data.genres.length > 0 && (
                    <ColumnLayout width="50%">
                      <div className="is-size-6">Genres</div>
                      <RowLayout childMarginRight="1em">
                        {movie.data.id === parseInt(id, 10) &&
                          movie.data.genres.map((genre, index) => (
                            <Tag key={index} type={TagColor.INFO}>
                              {genre.name ? genre.name : ""}
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
            {movie.data.summary && (
              <RowLayout marginTop="1em">
                <div>
                  <div className="is-size-5">Overview</div>
                  <div className="is-size-6">{movie.data.summary}</div>
                </div>
              </RowLayout>
            )}

            <RowLayout
              marginTop="1em"
              childMarginRight="2%"
              alignItems="flex-start"
            >
              {movie.data.directors && movie.data.directors.length > 0 && (
                <div>
                  <div className="is-size-6">Directed</div>
                  {movie.data.directors.map((director, index) => (
                    <div className="is-size-7" key={index}>
                      {director +
                        (movie.data && index + 1 === movie.data.directors.length
                          ? ""
                          : ", ")}
                    </div>
                  ))}
                </div>
              )}
              {movie.data.studio && (
                <div>
                  <div className="is-size-6">Studio</div>
                  <div className="is-size-7">{movie.data.studio}</div>
                </div>
              )}
              {movie.data.genres && movie.data.genres.length > 0 && (
                <ColumnLayout width="50%">
                  <div className="is-size-6">Genres</div>
                  <RowLayout childMarginRight="1em">
                    {movie.data.id === parseInt(id, 10) &&
                      movie.data.genres.map((genre, index) => (
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

        <Actors actors={movie.data.actors} />
      </Container>
    </MediaBackground>
  );
};

export { PlexMovie };
