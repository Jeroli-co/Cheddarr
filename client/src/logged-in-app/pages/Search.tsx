import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { SearchFilters } from "../../shared/enums/SearchFilters";
import { H1 } from "../../shared/components/Titles";
import { MediaPreviewCardGrid } from "../../shared/components/media/MediaPreviewCardGrid";
import styled from "styled-components";
import { useMedia } from "../../shared/hooks/useMedia";
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

const Container = styled.div`
  .media-cards {
    display: flex;
    flex-wrap: wrap;
  }

  .media-loading-container {
    display: flex;
  }
`;

const LoadingCard = styled.div`
  flex: 0 0 calc(16.66% - 10px);

  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    flex: 0 0 calc(25% - 10px);
  }

  height: 20px;
  margin: 5px;
  border: 3px solid ${(props) => props.theme.primaryLighter};
  background: ${(props) => props.theme.primaryLighter};
  border-radius: 12px;
  animation: 1s ease infinite running;

  @media screen and (min-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    &:nth-child(1) {
      animation-name: ${LoadingCard16};
    }

    &:nth-child(2) {
      animation-name: ${LoadingCard26};
    }

    &:nth-child(3) {
      animation-name: ${LoadingCard36};
    }

    &:nth-child(4) {
      animation-name: ${LoadingCard46};
    }

    &:nth-child(5) {
      animation-name: ${LoadingCard56};
    }

    &:nth-child(6) {
      animation-name: ${LoadingCard66};
    }
  }

  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    &:nth-child(1) {
      animation-name: ${LoadingCard14};
    }

    &:nth-child(2) {
      animation-name: ${LoadingCard24};
    }

    &:nth-child(3) {
      animation-name: ${LoadingCard34};
    }

    &:nth-child(4) {
      animation-name: ${LoadingCard44};
    }
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
  const mediaPage = useMedia(title, type, page);
  const pageRef = useRef<{ page: number; totalPages: number }>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    setPage(1);
    setMedia([]);
    // @ts-ignore
    pageRef.current = null;
  }, [title, type]);

  useLayoutEffect(() => {
    const loadNextPage = () => {
      if (
        pageRef.current &&
        pageRef.current.page < pageRef.current.totalPages
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
        console.log("you're at the bottom of the page");
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
      if (pageRef.current === null) {
        // @ts-ignore
        pageRef.current = {
          page: 1,
          totalPages: mediaPage.data?.totalPages,
        };
      }
    }
  }, [mediaPage.data]);

  if (
    media.length === 0 &&
    mediaPage.data &&
    mediaPage.data.results.length === 0
  ) {
    return <H1>Could not find any result for "{title}"</H1>;
  }

  return (
    <Container>
      <div className="media-cards">
        {media.map(
          (m, index) =>
            m.posterUrl && <MediaPreviewCardGrid key={index} media={m} />
        )}
      </div>
      <div className="media-loading-container">
        {mediaPage.isLoading && (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            {width > STATIC_STYLES.TABLET_MAX_WIDTH && <LoadingCard />}
            {width > STATIC_STYLES.TABLET_MAX_WIDTH && <LoadingCard />}
          </>
        )}
      </div>
    </Container>
  );
};

export { Search };
