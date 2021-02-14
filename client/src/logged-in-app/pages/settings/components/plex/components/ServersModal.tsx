import React, { useState } from "react";
import { Spinner } from "../../../../../../shared/components/Spinner";
import { IPlexServerInfo } from "../models/IPlexServerInfo";
import { usePlexServers } from "../../../../../../shared/hooks/usePlexServers";
import { useAPI } from "../../../../../../shared/hooks/useAPI";
import { APIRoutes } from "../../../../../../shared/enums/APIRoutes";
import { ComponentSizes } from "../../../../../../shared/enums/ComponentSizes";
import {
  Button,
  PrimaryButton,
} from "../../../../../../shared/components/Button";
import { IPlexConfig } from "../models/IPlexConfig";
import styled from "styled-components";
import { Modal } from "../../../../../../shared/components/Modal";
import { H2 } from "../../../../../../shared/components/Titles";
import { Buttons } from "../../../../../../shared/components/layout/Buttons";

const ServerContainer = styled.div`
  display: flex;
  align-items: center;
  input {
    cursor: pointer;
    margin-right: 20px;
  }
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

type PlexServerComponentProps = {
  server: IPlexServerInfo;
};

type ServersModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  selectServer: (config: IPlexConfig) => void;
};

const ServersModal = (props: ServersModalProps) => {
  const [serverSelected, setServerSelected] = useState<IPlexServerInfo | null>(
    null
  );

  const servers = usePlexServers();

  const { get } = useAPI();

  const linkServer = () => {
    if (serverSelected) {
      get<IPlexConfig>(
        APIRoutes.GET_PLEX_SERVER(serverSelected.serverName)
      ).then((serverDetail) => {
        if (serverDetail.data && serverDetail.status === 200) {
          props.selectServer(serverDetail.data);
          props.closeModal();
        }
      });
    }
  };

  const Server = ({ server }: PlexServerComponentProps) => {
    const _onChange = () => {
      setServerSelected(server);
    };

    return (
      <ServerContainer>
        <input
          type="radio"
          name={server.serverName}
          checked={
            serverSelected !== null &&
            server.serverName === serverSelected.serverName
          }
          onChange={_onChange}
        />
        <p>{server.serverName}</p>
      </ServerContainer>
    );
  };

  return (
    <Modal isOpen={props.isOpen} close={props.closeModal}>
      <header>
        <H2>Plex servers</H2>
      </header>
      <section>
        {servers.isLoading && <Spinner size={ComponentSizes.LARGE} />}
        {!servers.isLoading &&
          servers.data &&
          servers.data.map((server) => {
            return <Server key={server.serverName} server={server} />;
          })}
      </section>
      <footer>
        <Buttons>
          <PrimaryButton type="button" onClick={() => linkServer()}>
            Save changes
          </PrimaryButton>
          <Button type="button" onClick={() => props.closeModal()}>
            Cancel
          </Button>
        </Buttons>
      </footer>
    </Modal>
  );
};

export { ServersModal };
