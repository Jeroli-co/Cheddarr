import React from "react";
import styled from "styled-components";
import { IMedia } from "../models/IMedia";
import { MediaTypes } from "../enums/MediaTypes";

export const Tag = styled.div`
  width: min-content;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 12px;
  background: ${(props) => props.theme.grey};
  white-space: nowrap;
  margin: 10px;
`;

export const WarningTag = styled(Tag)`
  background: ${(props) => props.theme.warning};
`;

export const SuccessTag = styled(Tag)`
  background: ${(props) => props.theme.success};
`;

export const DangerTag = styled(Tag)`
  background: ${(props) => props.theme.danger};
`;

const MovieTagStyle = styled(Tag)`
  background: ${(props) => props.theme.movie};
`;

export const MovieTag = () => {
  return <MovieTagStyle>Movie</MovieTagStyle>;
};

const SeriesTagStyle = styled(Tag)`
  background: ${(props) => props.theme.series};
`;

export const SeriesTag = () => {
  return <SeriesTagStyle>Series</SeriesTagStyle>;
};

type MediaTagProps = {
  media: IMedia;
};

export const MediaTag = (props: MediaTagProps) => {
  if (props.media.mediaType === MediaTypes.MOVIES) {
    return <MovieTagStyle>Movie</MovieTagStyle>;
  } else if (props.media.mediaType === MediaTypes.SERIES) {
    return <SeriesTagStyle>Series</SeriesTagStyle>;
  } else {
    return <></>;
  }
};
