import React from "react";
import { Container } from "../../../elements/Container";
import { RowLayout } from "../../../elements/layouts";
import { Image } from "../../../elements/Image";
import { MediaRating } from "../../../elements/media/MediaRating";

const OnlineSeriesCard = ({ series }) => {
  return (
    <Container
      padding="1%"
      margin="1%"
      border="1px solid black"
      borderRadius="12px"
    >
      <RowLayout alignItems="flex-start">
        <Image
          src={series["thumbUrl"]}
          alt={series.title}
          width="12%"
          borderRadius="12px"
        />
        <Container width="100%" padding="1%">
          <RowLayout justifyContent="space-between">
            <h1 className="title is-3">{series.title}</h1>
            <MediaRating media={series} />
          </RowLayout>
          <RowLayout childPaddingRight="1em">
            {series["releaseDate"] && (
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Released"
              >
                {series["releaseDate"]}
              </p>
            )}
          </RowLayout>
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
    </Container>
  );
};

export { OnlineSeriesCard };
