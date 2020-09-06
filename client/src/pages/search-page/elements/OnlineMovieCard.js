import React from "react";
import { Container } from "../../../elements/Container";
import { RowLayout } from "../../../elements/layouts";
import { Image } from "../../../elements/Image";
import { MediaTitle } from "../../../elements/media/MediaTitle";

const OnlineMovieCard = ({ movie }) => {
  return (
    <Container padding="1%">
      <RowLayout alignItems="flex-start">
        <Image
          src={movie["thumbUrl"]}
          alt={movie.title}
          width="16%"
          borderRadius="12px"
        />

        <Container paddingRight="1%" paddingLeft="1%">
          <h1>{movie.title}</h1>
          <RowLayout childPaddingRight="1em">
            {movie["releaseDate"] && (
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Released"
              >
                {movie["releaseDate"]}
              </p>
            )}
          </RowLayout>
        </Container>
      </RowLayout>

      <div>
        {movie.summary && (
          <RowLayout marginTop="1em">
            <div>
              <div className="is-size-5">Overview</div>
              <div className="is-size-6">{movie.summary}</div>
            </div>
          </RowLayout>
        )}
      </div>
    </Container>
  );
};

export { OnlineMovieCard };
