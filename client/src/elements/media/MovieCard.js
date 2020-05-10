import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { usePlex } from "../../hooks/usePlex";
import { Spinner } from "../Spinner";
import { ColumnLayout, RowLayout } from "../layouts";
import { Tag, TagColor } from "../Tag";
import { Actors } from "../../widgets/media-recently-added/elements/Actors";
import { Image } from "../Image";
import { LineBulletList } from "./LineBulletList";
import { MediaTitle } from "./MediaTitle";
import { Container } from "../Container";
import { PlexButton } from "../PlexButton";
import { MediaRating } from "./MediaRating";
import { MediaBackground } from "./MediaBackground";
import { useWindowSize } from "../../hooks/useWindowSize";
import { TABLET_MAX_WIDTH } from "../../service/screen-service";

const MovieCard = ({ movie }) => {
  const { id } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const { getMovie } = usePlex();
  const { width } = useWindowSize();

  useEffect(() => {
    if (!movie) {
      getMovie(id).then((m) => {
        if (m) setMovieInfo(m);
      });
    } else {
      setMovieInfo(movie);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!movieInfo || movieInfo.id !== id)
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
    <MediaBackground image={movieInfo.artUrl}>
      <Container padding="1%">
        <RowLayout alignItems="flex-start">
          <Image
            src={movieInfo.thumbUrl}
            alt={movieInfo.title}
            width="16%"
            borderRadius="12px"
          />

          <Container paddingRight="1%" paddingLeft="1%">
            <MediaTitle media={movieInfo} />

            <LineBulletList>
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Released"
              >
                {movieInfo.releaseDate}
              </p>
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Content rating"
              >
                {movieInfo.contentRating}
              </p>
            </LineBulletList>

            {!movieInfo.isWatched && (
              <RowLayout marginTop="1em">
                <Tag type={TagColor.DARK} content="Unplayed" />
              </RowLayout>
            )}

            <RowLayout marginTop="1em" childMarginRight="1em">
              <MediaRating media={movieInfo} />
              <PlexButton
                onClick={() => window.open(movieInfo.webUrl)}
                text="Open in plex"
              />
            </RowLayout>

            {width > TABLET_MAX_WIDTH && (
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
                          {director.name +
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
                        {movieInfo.id === id &&
                          movieInfo.genres.map((genre, index) => (
                            <Tag
                              key={index}
                              type={TagColor.INFO}
                              content={genre.name}
                            />
                          ))}
                      </RowLayout>
                    </ColumnLayout>
                  )}
                </RowLayout>
              </div>
            )}
          </Container>
        </RowLayout>

        {width <= TABLET_MAX_WIDTH && (
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
                      {director.name +
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
                    {movieInfo.id === id &&
                      movieInfo.genres.map((genre, index) => (
                        <Tag
                          key={index}
                          type={TagColor.INFO}
                          content={genre.name}
                        />
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
