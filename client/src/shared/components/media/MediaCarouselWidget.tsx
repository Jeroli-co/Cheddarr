import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SwitchErrors } from "../errors/SwitchErrors";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { H2 } from "../Titles";
import { IMedia } from "../../models/IMedia";
import { Carousel } from "../layout/Carousel";
import { MediaPreviewCard } from "./MediaPreviewCard";
import { usePagination } from "../../hooks/usePagination";
import { MediaCardsLoader } from "./MediaCardsLoader";
import { useAPI } from "../../hooks/useAPI";
import { APIRoutes } from "../../enums/APIRoutes";
import { MediaTypes } from "../../enums/MediaTypes";

const Container = styled(H2)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: ${(props) => props.theme.color};
  white-space: nowrap;
  user-select: none;
`;

type MediaCarouselWidgetProps = {
  title: string;
  url: string;
  hasToGetFullMedia?: boolean;
};

export const MediaCarouselWidget = (props: MediaCarouselWidgetProps) => {
  const [media, setMedia] = useState<IMedia[]>([]);
  const [hidden, setHidden] = useState(false);
  const { data, loadPrev, loadNext, updateData } = usePagination<IMedia>(
    props.url,
    false
  );
  const loaderRef = useRef<HTMLDivElement>(null);
  const { get } = useAPI();
  const [hasMissingImage, setHasMissingImage] = useState(false);

  useEffect(() => {
    if (data.data && data.data.results) {
      setMedia([...media, ...data.data.results]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.data]);

  useEffect(() => {
    if (
      !hasMissingImage &&
      props.hasToGetFullMedia &&
      data.data &&
      data.data.results &&
      media
    ) {
      data.data.results.forEach((m) => {
        if (m.mediaType === MediaTypes.MOVIES) {
          get<IMedia>(APIRoutes.GET_MOVIE(m.tmdbId)).then((r) =>
            updateData(
              (e) => e.id === r.data.id,
              (e) => (e = r.data)
            )
          );
        } else if (m.mediaType === MediaTypes.SERIES) {
          get<IMedia>(APIRoutes.GET_SERIES(m.tmdbId)).then((r) =>
            updateData(
              (e) => e.id === r.data.id,
              (e) => (e = r.data)
            )
          );
        }
      });
      setHasMissingImage(true);
    } else if (hasMissingImage) {
      setHasMissingImage(false);
    }
  }, [media]);

  useEffect(() => {
    if (hasMissingImage && data && data.data && data.data.results) {
      const mediaCopy = [...media];
      const dataLength = data.data.results.length;
      mediaCopy.splice(
        mediaCopy.length - (dataLength + 1),
        dataLength,
        data.data.results
      );
      setMedia(mediaCopy);
    }
  }, [hasMissingImage]);

  useEffect(() => {
    if (loaderRef.current && media.length > 0) {
      loaderRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.isLoading]);

  if (data.status >= 400) {
    return <SwitchErrors status={data.status} />;
  }

  return (
    <div>
      <Container onClick={() => setHidden(!hidden)}>
        {props.title}
        {hidden && <Icon icon={faCaretRight} />}
        {!hidden && <Icon icon={faCaretDown} />}
      </Container>

      <br />
      {!hidden && (
        <Carousel loadPrev={loadPrev} loadNext={loadNext}>
          {media.map((m, index) => (
            <MediaPreviewCard key={index} media={m} />
          ))}
          {data.isLoading && (
            <MediaCardsLoader n={6} refIndex={3} ref={loaderRef} />
          )}
        </Carousel>
      )}
    </div>
  );
};
