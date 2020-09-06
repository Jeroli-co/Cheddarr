import React from "react";
import { Container } from "../../../elements/Container";
import { RowLayout } from "../../../elements/layouts";
import { Image } from "../../../elements/Image";
import { MediaTitle } from "../../../elements/media/MediaTitle";

const OnlineSeriesCard = ({ series }) => {
  return (
    <Container padding="1%">
      <RowLayout alignItems="flex-start">
        <Image
          src={series["thumbUrl"]}
          alt={series.title}
          width="16%"
          borderRadius="12px"
        />
        <Container paddingRight="1%" paddingLeft="1%">
          <h1>{series.title}</h1>
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
