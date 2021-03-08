import { IMedia } from "../../models/IMedia";
import { Carousel } from "../layout/Carousel";
import { MediaPreviewCard } from "./MediaPreviewCard";
import React from "react";

type MediaCarouselProps = {
  mediaList: IMedia[];
};

export const MediaCarousel = (props: MediaCarouselProps) => {
  return (
    <Carousel>
      {props.mediaList &&
        props.mediaList.map(
          (m, index) =>
            m.posterUrl && <MediaPreviewCard key={index} media={m} />
        )}
    </Carousel>
  );
};
