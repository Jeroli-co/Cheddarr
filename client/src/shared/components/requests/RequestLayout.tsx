import styled, { css } from "styled-components";
import React, { useState } from "react";
import { MediaTypes } from "../../enums/MediaTypes";
import {
  compareRequestCreationDateAsc,
  compareRequestCreationDateDesc,
  compareRequestDefault,
  compareRequestedUserAsc,
  compareRequestedUserDesc,
  compareRequestingUserAsc,
  compareRequestingUserDesc,
  compareRequestMediaTypeAsc,
  compareRequestMediaTypeDesc,
  compareRequestStatusAsc,
  compareRequestStatusDesc,
  compareRequestTitleAsc,
  compareRequestTitleDesc,
  compareRequestUpdatedDateAsc,
  compareRequestUpdatedDateDesc,
  IMediaRequest,
} from "../../models/IMediaRequest";
import { RequestStatus } from "../../enums/RequestStatus";
import { DangerIconButton, PrimaryButton, SuccessButton } from "../Button";
import { Icon } from "../Icon";
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { UserSmallCard } from "../UserSmallCard";
import { useRequestsContext } from "../../contexts/RequestsContext";
import { RequestTypes } from "../../enums/RequestTypes";
import { Tooltiped } from "../Tooltiped";
import { DangerTag, MediaTag, SuccessTag, WarningTag } from "../Tag";
import { useMedia } from "../../hooks/useMedia";
import { useHistory } from "react-router-dom";
import { routes } from "../../../router/routes";
import { useImage } from "../../hooks/useImage";
import { Image } from "../Image";
import { Buttons } from "../layout/Buttons";

export const ScrollingTable = styled.div`
  overflow-x: scroll;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE 11 */
  scrollbar-width: none; /* Firefox 64 */
  ::-webkit-scrollbar {
    display: none;
  }
`;

/* HEADER */
const RequestsHeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.primaryLight};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  min-width: 1500px;
  user-select: none;
`;

const RequestElement = styled.div`
  flex: 1 1 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;

  &:nth-child(1) {
    justify-content: flex-start;
    flex: 5 1 0;
  }

  &:nth-child(2) {
    flex: 3 1 0;
  }

  &:nth-child(3) {
    flex: 4 1 0;
  }

  &:nth-child(4) {
    flex: 3 1 0;
  }

  &:nth-child(5) {
    flex: 3 1 0;
  }

  &:nth-child(6) {
    flex: 3 1 0;
  }

  &:nth-child(7) {
    flex: 1 1 0;
    justify-content: flex-end;
  }
`;

export enum FilterDir {
  ASC = "asc",
  DESC = "desc",
}

type Filters = {
  title: FilterDir | undefined;
  mediaType: FilterDir | undefined;
  user: FilterDir | undefined;
  createdAt: FilterDir | undefined;
  updatedAt: FilterDir | undefined;
  status: FilterDir | undefined;
};

const defaultFilter: Filters = {
  title: undefined,
  mediaType: undefined,
  user: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  status: undefined,
};

const nextFilterDir = (f: FilterDir | undefined) => {
  switch (f) {
    case undefined:
      return FilterDir.DESC;
    case FilterDir.DESC:
      return FilterDir.ASC;
    default:
      return undefined;
  }
};

const RequestsHeaderElement = styled(RequestElement)<{
  cursor?: string;
}>`
  white-space: nowrap;
  cursor: ${(props) => (props.cursor ? props.cursor : "default")};
  position: relative;

  &:first-child {
    justify-content: center;
  }

  .filters-direction-icon {
    position: absolute;
    right: 25%;
    transform: translateX(25%);
  }
`;

type RequestHeaderProps = {
  requestType: RequestTypes;
};

export const RequestHeader = ({ requestType }: RequestHeaderProps) => {
  const { sortRequests } = useRequestsContext();

  const [filters, setFilters] = useState<Filters>(defaultFilter);

  const onTitleClick = () => {
    let nextDir = nextFilterDir(filters.title);
    let compare =
      nextDir === FilterDir.DESC
        ? compareRequestTitleDesc
        : nextDir === FilterDir.ASC
        ? compareRequestTitleAsc
        : compareRequestDefault;
    setFilters({ ...defaultFilter, title: nextDir });
    sortRequests(requestType, compare);
  };

  const onTypeClick = () => {
    let nextDir = nextFilterDir(filters.mediaType);
    let compare =
      nextDir === FilterDir.DESC
        ? compareRequestMediaTypeDesc
        : nextDir === FilterDir.ASC
        ? compareRequestMediaTypeAsc
        : compareRequestDefault;
    setFilters({
      ...defaultFilter,
      mediaType: nextDir,
    });
    sortRequests(requestType, compare);
  };

  const onUserClick = () => {
    let nextDir = nextFilterDir(filters.user);
    let compare =
      nextDir === FilterDir.DESC
        ? requestType === RequestTypes.INCOMING
          ? compareRequestingUserDesc
          : compareRequestedUserDesc
        : nextDir === FilterDir.ASC
        ? requestType === RequestTypes.INCOMING
          ? compareRequestingUserAsc
          : compareRequestedUserAsc
        : compareRequestDefault;
    setFilters({ ...defaultFilter, user: nextDir });
    sortRequests(requestType, compare);
  };

  const onCreatedAtClick = () => {
    let nextDir = nextFilterDir(filters.createdAt);
    let compare =
      nextDir === FilterDir.DESC
        ? compareRequestCreationDateDesc
        : nextDir === FilterDir.ASC
        ? compareRequestCreationDateAsc
        : compareRequestDefault;
    setFilters({
      ...defaultFilter,
      createdAt: nextDir,
    });
    sortRequests(requestType, compare);
  };

  const onUpdatedAtClick = () => {
    let nextDir = nextFilterDir(filters.updatedAt);
    let compare =
      nextDir === FilterDir.DESC
        ? compareRequestUpdatedDateDesc
        : nextDir === FilterDir.ASC
        ? compareRequestUpdatedDateAsc
        : compareRequestDefault;
    setFilters({
      ...defaultFilter,
      updatedAt: nextDir,
    });
    sortRequests(requestType, compare);
  };

  const onStatusClick = () => {
    let nextDir = nextFilterDir(filters.status);
    let compare =
      nextDir === FilterDir.DESC
        ? compareRequestStatusDesc
        : nextDir === FilterDir.ASC
        ? compareRequestStatusAsc
        : compareRequestDefault;
    setFilters({
      ...defaultFilter,
      status: nextDir,
    });
    sortRequests(requestType, compare);
  };

  return (
    <RequestsHeaderContainer>
      <RequestsHeaderElement cursor="pointer" onClick={() => onTitleClick()}>
        <p>TITLE</p>
        <span className="filters-direction-icon">
          {filters.title && filters.title === FilterDir.ASC && (
            <Icon icon={faArrowUp} size="xs" />
          )}
          {filters.title && filters.title === FilterDir.DESC && (
            <Icon icon={faArrowDown} size="xs" />
          )}
        </span>
      </RequestsHeaderElement>
      <RequestsHeaderElement cursor="pointer" onClick={() => onTypeClick()}>
        <p>TYPE</p>
        <span className="filters-direction-icon">
          {filters.mediaType && filters.mediaType === FilterDir.ASC && (
            <Icon icon={faArrowUp} size="xs" />
          )}
          {filters.mediaType && filters.mediaType === FilterDir.DESC && (
            <Icon icon={faArrowDown} size="xs" />
          )}
        </span>
      </RequestsHeaderElement>
      <RequestsHeaderElement cursor="pointer" onClick={() => onUserClick()}>
        <p>
          {requestType === RequestTypes.INCOMING
            ? "REQUESTING USER"
            : "REQUESTED USER"}
        </p>
        <span className="filters-direction-icon">
          {filters.user && filters.user === FilterDir.ASC && (
            <Icon icon={faArrowUp} size="xs" />
          )}
          {filters.user && filters.user === FilterDir.DESC && (
            <Icon icon={faArrowDown} size="xs" />
          )}
        </span>
      </RequestsHeaderElement>
      <RequestsHeaderElement
        cursor="pointer"
        onClick={() => onCreatedAtClick()}
      >
        <p> CREATED AT</p>
        <span className="filters-direction-icon">
          {filters.createdAt && filters.createdAt === FilterDir.ASC && (
            <Icon icon={faArrowUp} size="xs" />
          )}
          {filters.createdAt && filters.createdAt === FilterDir.DESC && (
            <Icon icon={faArrowDown} size="xs" />
          )}
        </span>
      </RequestsHeaderElement>
      <RequestsHeaderElement
        cursor="pointer"
        onClick={() => onUpdatedAtClick()}
      >
        <p>UPDATED AT</p>
        <span className="filters-direction-icon">
          {filters.updatedAt && filters.updatedAt === FilterDir.ASC && (
            <Icon icon={faArrowUp} size="xs" />
          )}
          {filters.updatedAt && filters.updatedAt === FilterDir.DESC && (
            <Icon icon={faArrowDown} size="xs" />
          )}
        </span>
      </RequestsHeaderElement>
      <RequestsHeaderElement cursor="pointer" onClick={() => onStatusClick()}>
        <p>STATUS</p>
        <span className="filters-direction-icon">
          {filters.status && filters.status === FilterDir.ASC && (
            <Icon icon={faArrowUp} size="xs" />
          )}
          {filters.status && filters.status === FilterDir.DESC && (
            <Icon icon={faArrowDown} size="xs" />
          )}
        </span>
      </RequestsHeaderElement>
      <RequestsHeaderElement />
    </RequestsHeaderContainer>
  );
};

/* FOOTER */
const RequestsFooterContainer = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: ${(props) => props.theme.primaryLight};
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  color: ${(props) => props.theme.primary};
  min-width: 1500px;
`;

export const RequestFooter = () => {
  return (
    <RequestsFooterContainer>
      <PrimaryButton type="button">
        <Icon icon={faArrowLeft} />
      </PrimaryButton>
      <PrimaryButton type="button">
        <Icon icon={faArrowRight} />
      </PrimaryButton>
    </RequestsFooterContainer>
  );
};

/* TITLE */
const RequestTitleContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const RequestMediaPoster = styled(Image)`
  margin-right: 10px;
  border-radius: 6px;
`;

const RequestMediaTitle = styled.p`
  font-size: 1.2em;
`;

type RequestImageAndTitleProps = {
  id: string;
  title: string;
  type: MediaTypes;
  posterUrl?: string;
};

const RequestImageAndTitle = ({
  id,
  title,
  type,
  posterUrl,
}: RequestImageAndTitleProps) => {
  const history = useHistory();
  const poster = useImage(posterUrl);
  return (
    <RequestTitleContainer
      onClick={() =>
        history.push(
          type === MediaTypes.MOVIES
            ? routes.MOVIE.url(id.toString())
            : routes.SERIES.url(id.toString())
        )
      }
    >
      <RequestMediaPoster
        src={posterUrl}
        alt=""
        loaded={poster.loaded}
        width="60px"
        height="90px"
        cursor="pointer"
      />
      <RequestMediaTitle>{title}</RequestMediaTitle>
    </RequestTitleContainer>
  );
};

/* LAYOUT */
const RequestContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 1500px;
  border: 1px solid ${(props) => props.theme.primaryLight};
`;

type RequestLayoutProps = {
  request: IMediaRequest;
  requestType: RequestTypes;
};

export const RequestLayout = ({ request, requestType }: RequestLayoutProps) => {
  const { acceptRequest, refuseRequest, deleteRequest } = useRequestsContext();

  const media = useMedia(request.media.mediaType, request.media.tmdbId);

  return (
    <RequestContainer>
      <RequestElement>
        <RequestImageAndTitle
          id={request.media.tmdbId}
          type={request.media.mediaType}
          title={request.media.title}
          posterUrl={media.data ? media.data.posterUrl : undefined}
        />
      </RequestElement>
      <RequestElement>
        <MediaTag media={request.media} />
      </RequestElement>
      <RequestElement>
        <UserSmallCard
          user={
            requestType === RequestTypes.INCOMING
              ? request.requestingUser
              : request.requestedUser
          }
        />
      </RequestElement>
      <RequestElement>
        {new Date(request.createdAt).toLocaleDateString()}
      </RequestElement>
      <RequestElement>
        {new Date(request.updatedAt).toLocaleDateString()}
      </RequestElement>
      <RequestElement>
        {request.status === RequestStatus.PENDING && (
          <WarningTag>{request.status.toUpperCase()}</WarningTag>
        )}
        {request.status === RequestStatus.REFUSED && (
          <DangerTag>{request.status.toUpperCase()}</DangerTag>
        )}
        {request.status === RequestStatus.APPROVED && (
          <SuccessTag>{request.status.toUpperCase()}</SuccessTag>
        )}
      </RequestElement>
      <RequestElement>
        {requestType === RequestTypes.INCOMING &&
          request.status === RequestStatus.PENDING && (
            <Buttons>
              <SuccessButton onClick={() => acceptRequest(request)}>
                <Icon icon={faCheck} />
              </SuccessButton>
              <DangerIconButton onClick={() => refuseRequest(request)}>
                <Icon icon={faTimes} />
              </DangerIconButton>
            </Buttons>
          )}
        {request.status !== RequestStatus.PENDING && (
          <Tooltiped text="Delete request">
            <DangerIconButton onClick={() => deleteRequest(request)}>
              <Icon icon={faTimes} />
            </DangerIconButton>
          </Tooltiped>
        )}
      </RequestElement>
    </RequestContainer>
  );
};