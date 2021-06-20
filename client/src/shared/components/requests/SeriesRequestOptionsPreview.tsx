import React from "react";
import { H3 } from "../Titles";
import { useSeriesRequestOptionsContext } from "../../contexts/SeriesRequestOptionsContext";
import { Tag } from "../Tag";
import { Row } from "../layout/Row";
import { Tooltiped } from "../Tooltiped";
import { Help } from "../Help";

export const SeriesRequestOptionsPreview = () => {
  const { options } = useSeriesRequestOptionsContext();

  return (
    <div>
      <H3>Request preview : </H3>
      <Row>
        {options.seasons.length === 0 && (
          <Help>
            <i>No elements selected</i>
          </Help>
        )}
        {options.seasons.length > 0 &&
          options.seasons.map((s) => (
            <Tag key={s.seasonNumber}>
              Season {s.seasonNumber}{" "}
              {s.episodes.length > 0 && (
                <Tooltiped text="Episodes">({s.episodes.length})</Tooltiped>
              )}
            </Tag>
          ))}
      </Row>
    </div>
  );
};
