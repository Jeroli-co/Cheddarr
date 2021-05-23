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
  const { data, loadPrev, loadNext } = usePagination<IMedia>(props.url, false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { get } = useAPI();

  useEffect(() => {
    if (data.data && data.data.results) {
      const mediaCopy = media;
      setMedia([...media, ...data.data.results]);
      if (props.hasToGetFullMedia) {
        const paginatedDataCopy = data.data.results;
        paginatedDataCopy.forEach((m) => {
          if (m.mediaType === MediaTypes.MOVIES) {
            get<IMedia>(APIRoutes.GET_MOVIE(m.tmdbId)).then((r) => {
              if (r.data) {
                m = r.data;
              }
            });
          } else if (m.mediaType === MediaTypes.SERIES) {
            get<IMedia>(APIRoutes.GET_SERIES(m.tmdbId)).then((r) => {
              if (r.data) {
                m = r.data;
              }
            });
          }
        });
        setMedia([...mediaCopy, ...paginatedDataCopy]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.data]);

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
