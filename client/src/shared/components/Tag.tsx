import React from "react";
import styled from "styled-components";
import { MediaTypes } from "../enums/MediaTypes";
import {
  IMedia,
  isEpisode,
  isMovie,
  isSeason,
  isSeries,
} from "../models/IMedia";

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

const MovieTag = styled(Tag)`
  background: ${(props) => props.theme.movie};
`;

const SeriesTag = styled(Tag)`
  background: ${(props) => props.theme.series};
`;

const SeasonTag = styled(Tag)`
  background: ${(props) => props.theme.season};
`;

const EpisodeTag = styled(Tag)`
  background: ${(props) => props.theme.episode};
`;

type MediaTagProps = {
  media?: IMedia;
  type?: MediaTypes;
};

export const MediaTag = (props: MediaTagProps) => {
  if (
    (props.type && props.type === MediaTypes.MOVIES) ||
    isMovie(props.media)
  ) {
    return <MovieTag>Movie</MovieTag>;
  } else if (
    (props.type && props.type === MediaTypes.SERIES) ||
    isSeries(props.media)
  ) {
    return <SeriesTag>Series</SeriesTag>;
  } else if (isSeason(props.media)) {
    return <SeasonTag>Season</SeasonTag>;
  } else if (isEpisode(props.media)) {
    return <EpisodeTag>Episode</EpisodeTag>;
  } else {
    return <></>;
  }
};
