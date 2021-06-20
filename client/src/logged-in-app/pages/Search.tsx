import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { SearchFilters } from "../../shared/enums/SearchFilters";
import { H1 } from "../../shared/components/Titles";
import { MediaPreviewCard } from "../../shared/components/media/MediaPreviewCard";
import styled from "styled-components";
import { useSearchMedia } from "../../shared/hooks/useSearchMedia";
import { IMedia } from "../../shared/models/IMedia";
import { IAsyncCall } from "../../shared/models/IAsyncCall";
import { IPaginated } from "../../shared/models/IPaginated";
import { MediaCardsLoader } from "../../shared/components/media/MediaCardsLoader";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

type SearchParams = {
  title: string;
  type: SearchFilters;
};

export const Search = () => {
  const { title, type } = useParams<SearchParams>();

  const [media, setMedia] = useState<IMedia[]>([]);
  const [page, setPage] = useState(1);
  const mediaPage = useSearchMedia(title, type, page);
  const pageRef = useRef<{ page: number; totalPages: number }>(null);
  const mediaPageRef = useRef<IAsyncCall<IPaginated<IMedia>>>(null);

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
    if (mediaPage.data && mediaPage.data.results) {
      setMedia([...media, ...mediaPage.data.results]);
      // @ts-ignore
      pageRef.current = {
        page: mediaPage.data?.page,
        totalPages: mediaPage.data?.totalPages,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {media.map((m, index) => (
        <MediaPreviewCard key={index} media={m} />
      ))}
      {mediaPage.isLoading && <MediaCardsLoader n={20} />}
    </Container>
  );
};
