import styled, { css } from "styled-components";
import React, { useState } from "react";
import { MediaTypes } from "../../../../shared/enums/MediaTypes";
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
  getMediaTypeFromRequest,
  getPosterFromRequest,
  getTitleFromRequest,
  IMediaRequest,
} from "../../../../shared/models/IMediaRequest";
import { RequestStatus } from "../../../../shared/enums/RequestStatus";
import {
  DangerIconButton,
  PrimaryButton,
  SuccessButton,
} from "../../../../shared/components/Button";
import { Icon } from "../../../../shared/components/Icon";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { UserSmallCard } from "../../../../shared/components/UserSmallCard";
import { useRequestsContext } from "../../../../shared/contexts/RequestsContext";
import { RequestTypes } from "../../../../shared/enums/RequestTypes";
import { Tooltiped } from "../../../../shared/components/Tooltiped";
import {
  DangerTag,
  MovieTag,
  SeriesTag,
  SuccessTag,
  WarningTag,
} from "../../plex-media/components/Tag";

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
  padding: 20px;
  background: ${(props) => props.theme.primaryLight};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  min-width: 1500px;
  user-select: none;
`;

const RequestElement = styled.div<{
  grow?: number;
  clickable?: boolean;
}>`
  flex-basis: ${(props) => {
    let p = ((props.grow ? props.grow : 1) / 7) * 100;
    return p + "%";
  }};

  &:first-child {
    display: flex;
    justify-content: flex-start;
  }

  &:last-child {
    display: flex;
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

const RequestsHeaderElement = styled(RequestElement)<{ dir?: FilterDir }>`
  font-weight: bold;
  white-space: nowrap;
  ${(props) =>
    props.clickable &&
    css`
      cursor: pointer;
    `}

  position: relative;

  &:not(:last-child):before {
    content: "";
    position: absolute;
    left: 90%;
    top: 30%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid ${(props) => props.theme.primary};
    filter: brightness(
      ${(props) => (props.dir && props.dir === FilterDir.ASC ? "100%" : "200%")}
    );
  }

  &:not(:last-child):after {
    content: "";
    position: absolute;
    left: 90%;
    top: 70%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${(props) => props.theme.primary};
    filter: brightness(
      ${(props) =>
        props.dir && props.dir === FilterDir.DESC ? "100%" : "200%"}
    );
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
      <RequestsHeaderElement
        grow={2}
        clickable
        onClick={() => onTitleClick()}
        dir={filters.title}
      >
        TITLE
      </RequestsHeaderElement>
      <RequestsHeaderElement
        clickable
        onClick={() => onTypeClick()}
        dir={filters.mediaType}
      >
        TYPE
      </RequestsHeaderElement>
      <RequestsHeaderElement
        clickable
        onClick={() => onUserClick()}
        dir={filters.user}
      >
        {requestType === RequestTypes.INCOMING
          ? "REQUESTING USER"
          : "REQUESTED USER"}
      </RequestsHeaderElement>
      <RequestsHeaderElement
        clickable
        onClick={() => onCreatedAtClick()}
        dir={filters.createdAt}
      >
        CREATED AT
      </RequestsHeaderElement>
      <RequestsHeaderElement
        clickable
        onClick={() => onUpdatedAtClick()}
        dir={filters.updatedAt}
      >
        UPDATED AT
      </RequestsHeaderElement>
      <RequestsHeaderElement
        clickable
        onClick={() => onStatusClick()}
        dir={filters.status}
      >
        STATUS
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
      <PrimaryButton>
        <Icon icon={faArrowLeft} />
      </PrimaryButton>
      <PrimaryButton>
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

const RequestMediaPoster = styled.img`
  margin-right: 10px;
  width: 60px;
  height: 90px;
  border-radius: 6px;
`;

const RequestMediaTitle = styled.p`
  font-size: 1.2em;
`;

type RequestImageAndTitleProps = {
  title: string;
  posterUrl: string;
};

const RequestImageAndTitle = ({
  title,
  posterUrl,
}: RequestImageAndTitleProps) => {
  // const history = useHistory();
  return (
    <RequestTitleContainer onClick={() => {}}>
      <RequestMediaPoster src={posterUrl} alt="User" />
      <RequestMediaTitle>{title}</RequestMediaTitle>
    </RequestTitleContainer>
  );
};

/* ACTIONS */
const Actions = styled.div`
  display: flex;
  > *:not(:last-child) {
    margin-right: 5px;
  }
`;

/* LAYOUT */
const RequestContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  min-width: 1500px;
  border: 1px solid ${(props) => props.theme.primaryLight};
`;

type RequestLayoutProps = {
  request: IMediaRequest;
  requestType: RequestTypes;
};

export const RequestLayout = ({ request, requestType }: RequestLayoutProps) => {
  let posterUrl = getPosterFromRequest(request);
  let title = getTitleFromRequest(request);
  let type = getMediaTypeFromRequest(request);

  const { acceptRequest, refuseRequest, deleteRequest } = useRequestsContext();

  return (
    <RequestContainer>
      {posterUrl && title && (
        <RequestElement grow={2}>
          <RequestImageAndTitle title={title} posterUrl={posterUrl} />
        </RequestElement>
      )}
      <RequestElement>
        {type && type === MediaTypes.MOVIES ? <MovieTag /> : <SeriesTag />}
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
      <RequestElement>{request.createdAt}</RequestElement>
      <RequestElement>{request.updatedAt}</RequestElement>
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
            <Actions>
              <SuccessButton onClick={() => acceptRequest(request)}>
                <Icon icon={faCheck} />
              </SuccessButton>
              <DangerIconButton onClick={() => refuseRequest(request)}>
                <Icon icon={faTimes} />
              </DangerIconButton>
            </Actions>
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
