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
  display: inline-block;
  height: 25px;
  padding: 0 0.5em;
  border-radius: 6px;
  text-align: center;
  line-height: 25px;
  background: ${(props) => props.theme.grey};
  white-space: nowrap;
  margin: 10px;
`;

export const IconTag = styled(Tag)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 50%;
  font-size: 8px;
  width: 20px;
  height: 20px;
  padding: 0;
`;

export const WarningTag = styled(Tag)`
  background: ${(props) => props.theme.warning};
`;

export const SuccessTag = styled(Tag)`
  background: ${(props) => props.theme.success};
`;

export const SuccessIconTag = styled(IconTag)`
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

export const MediaTag = ({ media, type }: MediaTagProps) => {
  if (type === MediaTypes.MOVIES || isMovie(media)) {
    return <MovieTag>Movie</MovieTag>;
  } else if (type === MediaTypes.SERIES || isSeries(media)) {
    return <SeriesTag>Series</SeriesTag>;
  } else if (isSeason(media)) {
    return <SeasonTag>Season</SeasonTag>;
  } else if (isEpisode(media)) {
    return <EpisodeTag>Episode</EpisodeTag>;
  } else {
    return <></>;
  }
};
