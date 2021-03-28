import React from "react";
import styled from "styled-components";
import { MediaServerTypes } from "../../../../shared/enums/MediaServersTypes";
import { PrimaryIconButton } from "../../../../shared/components/Button";
import { Icon } from "../../../../shared/components/Icon";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "../../../../shared/components/Spinner";
import { InputField } from "../../../../shared/components/inputs/InputField";
import { Checkbox } from "../../../../shared/components/inputs/Checkbox";
import { IMediaServerConfig } from "../../../../shared/models/IMediaServerConfig";
import { useMediaServerLibraries } from "../../../../shared/hooks/useMediaServerLibrariesService";
import { PrimaryDivider } from "../../../../shared/components/Divider";
import { H2, H3 } from "../../../../shared/components/Titles";
import { IJob, JobActionsEnum } from "../../../../shared/models/IJob";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { useAPI } from "../../../../shared/hooks/useAPI";
import { useAlert } from "../../../../shared/contexts/AlertContext";

const Header = styled.div`
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.primaryLight};
`;

const Item = styled.div`
  padding: 20px;
  border-left: 1px solid ${(props) => props.theme.primary};
  border-right: 1px solid ${(props) => props.theme.primary};
  border-bottom: 1px solid ${(props) => props.theme.primary};
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
`;

const ItemHeader = styled(Header)`
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  background: ${(props) => props.theme.primary};
`;

const Libraries = styled.div`
  padding: 20px;
`;

type MediaServerInfoProps = {
  configId: string;
  serverName: string;
  mediaServerType: MediaServerTypes;
};

const MediaServerInfo = (props: MediaServerInfoProps) => {
  const { libraries, updateLibrary } = useMediaServerLibraries(
    props.mediaServerType,
    props.configId
  );
  const { patch } = useAPI();
  const { pushInfo, pushDanger } = useAlert();

  const fullSync = () => {
    patch<IJob>(APIRoutes.PATCH_JOB("plex-full-sync"), {
      action: JobActionsEnum.RUN,
    }).then((res) => {
      if (res.status === 200) {
        pushInfo("Full sync is running");
      } else {
        pushDanger("Cannot run full sync");
      }
    });
  };

  return (
    <Item>
      <ItemHeader>
        <H2>{props.serverName}</H2>
        <PrimaryIconButton type="button" onClick={() => fullSync()}>
          <Icon icon={faSync} />
        </PrimaryIconButton>
      </ItemHeader>
      <Libraries>
        <H3>Libraries</H3>
        {libraries.isLoading && <Spinner />}
        {!libraries.isLoading &&
          libraries.data &&
          libraries.data.map((l, index) => (
            <InputField isInline key={index}>
              <Checkbox
                round
                checked={l.enabled}
                onChange={() => updateLibrary(l)}
              />
              <label>{l.name}</label>
            </InputField>
          ))}
      </Libraries>
    </Item>
  );
};

type MediaServersInfoProps = {
  config: IMediaServerConfig[];
};

export const MediaServersInfo = (props: MediaServersInfoProps) => {
  return (
    <div>
      <Header>
        <p>Server name</p>
        <p>Actions</p>
      </Header>
      {props.config.map((c, index) => (
        <span key={index}>
          <MediaServerInfo
            key={index}
            configId={c.id}
            serverName={c.name}
            mediaServerType={MediaServerTypes.PLEX}
          />
          {index !== props.config.length - 1 && <PrimaryDivider />}
        </span>
      ))}
    </div>
  );
};
