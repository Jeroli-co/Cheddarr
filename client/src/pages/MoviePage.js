import React, { useEffect, useState } from "react";
import { usePlex } from "../hooks/usePlex";
import { useParams } from "react-router";
import { ColumnLayout, RowLayout } from "../elements/layouts";
import { MediaExtendedCardHead } from "../widgets/media-recently-added/elements/MediaExtendedCardHead";
import { Tag, TagColor } from "../elements/Tag";
import { Actors } from "../widgets/media-recently-added/elements/Actors";
import styled from "styled-components";
import { Spinner } from "../elements/Spinner";

const MediaExtendedCardStyle = styled.div`
  margin: 0;
  padding: 1%;
`;

const MediaDetailsPoster = styled.img`
  width: 20%;
  height: auto;
  border-radius: 12px;
`;

const MediaDetailsInfo = styled.div`
  padding-left: 1%;
  padding-right: 1%;
`;

const MoviePage = () => {
  const { getMovie } = usePlex();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovie(id).then((m) => {
      if (m) setMovie(m);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!movie || movie.id !== id)
    return (
      <Spinner
        justifyContent="center"
        color="primary"
        size="2x"
        padding="1em"
      />
    );

  return (
    <MediaExtendedCardStyle>
      <RowLayout alignItems="flex-start">
        <MediaDetailsPoster src={movie.thumbUrl} alt={movie.title} />
        <MediaDetailsInfo>
          <MediaExtendedCardHead media={movie} />

          <RowLayout childMarginTop="1em">
            <div>
              <div className="is-size-5">Overview</div>
              <div className="is-size-6">{movie.summary}</div>
            </div>
          </RowLayout>

          <RowLayout
            alignItems="space-between"
            marginTop="1em"
            childMarginRight="1%"
          >
            <ColumnLayout width="20%">
              <p className="is-size-6">Directed</p>
              {movie.directors.map((director, index) => (
                <p className="is-size-7" key={index}>
                  {director.name +
                    (index + 1 === movie.directors.length ? "" : ", ")}
                </p>
              ))}
            </ColumnLayout>

            <ColumnLayout width="20%">
              <p className="is-size-6">Studio</p>
              <p className="is-size-7">{movie.studio}</p>
            </ColumnLayout>

            <ColumnLayout>
              <p className="is-size-6">Genres</p>
              <RowLayout childMarginRight="1%" wrap="wrap">
                {movie.genres.map((genre, index) => (
                  <Tag key={index} type={TagColor.INFO} content={genre.name} />
                ))}
              </RowLayout>
            </ColumnLayout>
          </RowLayout>
        </MediaDetailsInfo>
      </RowLayout>
      <Actors actors={movie.actors} />
    </MediaExtendedCardStyle>
  );
};

export { MoviePage };
