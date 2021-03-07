import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { SearchFilters } from "../../shared/enums/SearchFilters";
import { H1 } from "../../shared/components/Titles";
import { MediaPreviewCardGrid } from "../../shared/components/media/MediaPreviewCardGrid";
import styled from "styled-components";
import { useSearchMedia } from "../../shared/hooks/useSearchMedia";
import { IMedia } from "../../shared/models/IMedia";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";
import {
  LoadingCard14,
  LoadingCard16,
  LoadingCard24,
  LoadingCard26,
  LoadingCard34,
  LoadingCard36,
  LoadingCard44,
  LoadingCard46,
  LoadingCard56,
  LoadingCard66,
} from "../../shared/components/animations/Animations";
import { useWindowSize } from "../../shared/hooks/useWindowSize";
import { IAsyncCall } from "../../shared/models/IAsyncCall";
import { IPaginated } from "../../shared/models/IPaginated";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;

  .media-loading-container {
    display: flex;
    flex-wrap: wrap;
  }
`;

const LoadingCard = styled.div<{
  index: number;
  size: { width: number; height: number };
}>`
  width: ${(props) => props.size.width}px;
  height: ${(props) => props.size.height}px;
  margin: 5px;
  border: 3px solid ${(props) => props.theme.primaryLight};
  background: ${(props) => props.theme.primaryLight};
  border-radius: 12px;
  animation: 1s ease infinite running;

  @media screen and (min-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    animation-name: ${(props) => {
      switch (props.index) {
        case 1:
          return LoadingCard16;
        case 2:
          return LoadingCard26;
        case 3:
          return LoadingCard36;
        case 4:
          return LoadingCard46;
        case 5:
          return LoadingCard56;
        case 6:
          return LoadingCard66;
        default:
          return;
      }
    }};
  }

  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    animation-name: ${(props) => {
      switch (props.index) {
        case 1:
          return LoadingCard14;
        case 2:
          return LoadingCard24;
        case 3:
          return LoadingCard34;
        case 4:
          return LoadingCard44;
        default:
          return;
      }
    }};
  }
`;

type SearchParams = {
  title: string;
  type: SearchFilters;
};

const Search = () => {
  const { title, type } = useParams<SearchParams>();

  const [media, setMedia] = useState<IMedia[]>([]);
  const [page, setPage] = useState(1);
  const mediaPage = useSearchMedia(title, type, page);
  const pageRef = useRef<{ page: number; totalPages: number }>(null);
  const mediaPageRef = useRef<IAsyncCall<IPaginated<IMedia>>>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setPage(1);
    setMedia([]);
    // @ts-ignore
    pageRef.current = null;
  }, [title, type]);

  useEffect(() => {
    // @ts-ignore
    mediaPageRef.current = mediaPage;
  }, [mediaPage]);

  useLayoutEffect(() => {
    const loadNextPage = () => {
      if (
        pageRef.current &&
        pageRef.current.page < pageRef.current.totalPages &&
        mediaPageRef.current &&
        !mediaPageRef.current.isLoading
      ) {
        setPage(pageRef.current.page + 1);
        // @ts-ignore
        pageRef.current = {
          ...pageRef.current,
          page: pageRef.current.page + 1,
        };
      }
    };

    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadNextPage();
      }
    });

    return () => {
      window.removeEventListener("scroll", loadNextPage);
    };
  }, []);

  useEffect(() => {
    if (mediaPage.data) {
      setMedia([...media, ...mediaPage.data.results]);
      // @ts-ignore
      pageRef.current = {
        page: mediaPage.data?.page,
        totalPages: mediaPage.data?.totalPages,
      };
    }
  }, [mediaPage.data]);

  useEffect(() => {
    if (containerRef.current) {
      const numberOfElem =
        width < STATIC_STYLES.MOBILE_MAX_WIDTH
          ? 1
          : width < STATIC_STYLES.TABLET_MAX_WIDTH
          ? 4
          : 6;
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = containerWidth / numberOfElem - 10;
      const cardHeight = cardWidth + cardWidth / 2;
      setCardSize({ width: cardWidth, height: cardHeight });
    }
  }, [width, containerRef.current]);

  if (
    media.length === 0 &&
    mediaPage.data &&
    mediaPage.data.results.length === 0
  ) {
    return <H1>Could not find any result for "{title}"</H1>;
  }

  return (
    <Container ref={containerRef}>
      {media.map((m, index) => (
        <MediaPreviewCardGrid key={index} media={m} size={cardSize} />
      ))}
      {mediaPage.isLoading && (
        <>
          <LoadingCard index={1} size={cardSize} />
          <LoadingCard index={2} size={cardSize} />
          <LoadingCard index={3} size={cardSize} />
          <LoadingCard index={4} size={cardSize} />
          {width > STATIC_STYLES.TABLET_MAX_WIDTH && (
            <LoadingCard index={5} size={cardSize} />
          )}
          {width > STATIC_STYLES.TABLET_MAX_WIDTH && (
            <LoadingCard index={6} size={cardSize} />
          )}
        </>
      )}
    </Container>
  );
};

export { Search };
