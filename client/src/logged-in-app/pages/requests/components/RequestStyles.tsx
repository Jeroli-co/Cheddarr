import styled, { css } from "styled-components";
import React, { useState } from "react";
import { MediaTypes } from "../../../enums/MediaTypes";
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
} from "../models/IMediaRequest";
import { RequestStatus } from "../enums/RequestStatus";
import {
  DangerButton,
  PrimaryOutlinedButton,
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
import { useRequestsContext } from "../contexts/RequestsContext";
import { RequestTypes } from "../enums/RequestTypes";
import { Tooltiped } from "../../../../shared/components/Tooltiped";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";

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
  color: ${(props) => props.theme.primary};
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
      <PrimaryOutlinedButton>
        <Icon icon={faArrowLeft} />
      </PrimaryOutlinedButton>
      <PrimaryOutlinedButton>
        <Icon icon={faArrowRight} />
      </PrimaryOutlinedButton>
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

/* TYPE */
const MediaType = styled.div<{ type: MediaTypes }>`
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 12px;
  font-weight: bold;
  width: min-content;
  color: ${(props) => props.theme.primary};
  background: ${(props) => {
    switch (props.type) {
      case MediaTypes.MOVIES:
      case MediaTypes.MOVIE:
        return "#3E92EA";
      case MediaTypes.EPISODE:
      case MediaTypes.EPISODES:
      case MediaTypes.SEASON:
      case MediaTypes.SEASONS:
      case MediaTypes.SHOW:
      case MediaTypes.SERIES:
        return "#9267b5";
      default:
        return "#888888";
    }
  }};
`;

/* STATUS */
const Status = styled.div<{ status: RequestStatus }>`
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 12px;
  font-weight: bold;
  width: min-content;
  color: ${(props) => props.theme.primary};
  background: ${(props) => {
    switch (props.status) {
      case RequestStatus.APPROVED:
        return props.theme.success;
      case RequestStatus.REFUSED:
        return props.theme.danger;
      default:
        return props.theme.warning;
    }
  }};
`;

/* ACTIONS */
const Actions = styled.div`
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
        {type && <MediaType type={type}>{type.toUpperCase()}</MediaType>}
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
        <Status status={request.status}>{request.status.toUpperCase()}</Status>
      </RequestElement>
      <RequestElement>
        {requestType === RequestTypes.INCOMING &&
          request.status === RequestStatus.PENDING && (
            <Actions>
              <SuccessButton onClick={() => acceptRequest(request)}>
                <Icon icon={faCheck} />
              </SuccessButton>
              <DangerButton onClick={() => refuseRequest(request)}>
                <Icon icon={faTimes} />
              </DangerButton>
            </Actions>
          )}
        {request.status !== RequestStatus.PENDING && (
          <Tooltiped text="Delete request">
            <DangerButton onClick={() => deleteRequest(request)}>
              <Icon icon={faTimes} />
            </DangerButton>
          </Tooltiped>
        )}
      </RequestElement>
    </RequestContainer>
  );
};
