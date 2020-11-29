import React, { useContext, useState } from "react";
import {
  faEdit,
  faExclamationCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../elements/layouts";
import { SubmitConfig } from "../SubmitConfig";
import { LinkPlexAccount } from "./elements/LinkPlexAccount";
import { ServersModal } from "./elements/ServersModal";
import { UnlinkAccountModal } from "./elements/UnlinkAccountModal";
import { UnlinkServerModal } from "./elements/UnlinkServerModal";
import Spinner from "../../../elements/Spinner";
import { PlexService } from "../../../../services/PlexService";
import { PlexConfigContext } from "../../../../contexts/plex-config/PlexConfigContext";

const PlexConfig = () => {
  const [isServersModalActive, setIsServersModalActive] = useState(false);
  const [isUnlinkServerModalActive, setIsUnlinkServerModalActive] = useState(
    false
  );
  const [isUnlinkAccountModalActive, setIsUnlinkAccountModalActive] = useState(
    false
  );

  const { handleSubmit, formState, reset } = useForm();
  const {
    config,
    isLoading,
    isPlexServerLinked,
    isPlexAccountLinked,
  } = useContext(PlexConfigContext);

  const _onUnlinkPlexServer = (machineId: number) => {
    PlexService.RemovePlexServer(machineId).then((res) => {
      if (res.error === null) setIsUnlinkServerModalActive(false);
    });
  };

  const _onUnlinkPlexAccount = () => {
    PlexService.UnlinkPlexAccount().then((res) => {
      if (res.error === null) setIsUnlinkAccountModalActive(false);
    });
  };

  const _onSubmit = (data: any) => {
    let newConfig: any = {};
    formState.dirtyFields.forEach((key) => {
      newConfig[key] = data[key];
    });
    PlexService.UpdateConfig(newConfig).then((res) => {
      if (res.error === null) reset();
    });
  };

  if (isLoading) return <Spinner color="primary" size="3x" />;

  if (config === null) return <div />;

  return (
    <div className="PlexConfig" data-testid="PlexConfig">
      <RowLayout
        justifyContent="space-between"
        borderBottom="1px solid LightGrey"
      >
        <h1 className="is-size-1">Plex</h1>
        <LinkPlexAccount />
      </RowLayout>

      {isPlexAccountLinked() && (
        <div>
          <form onSubmit={handleSubmit(_onSubmit)}>
            <br />
            <p className="subtitle is-3">Plex server</p>
            {isPlexServerLinked() && (
              <RowLayout justifyContent="space-between" marginTop="2%">
                <p className="is-size-5 has-text-weight-light">
                  {config.servers[0]["name"]}
                </p>
                <button
                  type="button"
                  className="button is-small is-rounded is-info"
                  onClick={() => setIsServersModalActive(true)}
                  data-tooltip="Change server"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  type="button"
                  className="button is-small is-rounded is-danger"
                  onClick={() => setIsUnlinkServerModalActive(true)}
                  data-tooltip="Unlink server"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </RowLayout>
            )}
            {!isPlexServerLinked() && (
              <button
                className="button is-primary"
                type="button"
                onClick={() => setIsServersModalActive(true)}
              >
                Link Plex server
              </button>
            )}
            <SubmitConfig isFormDirty={formState.dirty} />
          </form>
          <hr />
          <p className="subtitle is-3">Danger zone</p>
          <div className="content">
            <p className="is-size-7">
              <FontAwesomeIcon icon={faExclamationCircle} /> Be careful with
              that option
            </p>
            <button
              className="button is-danger"
              type="button"
              onClick={() => setIsUnlinkAccountModalActive(true)}
            >
              Unlink Plex Account
            </button>
          </div>
        </div>
      )}

      {isServersModalActive && (
        <ServersModal onClose={() => setIsServersModalActive(false)} />
      )}
      {isUnlinkServerModalActive && config["servers"].length > 0 && (
        <UnlinkServerModal
          machineName={config.servers[0]["name"]}
          onUnlink={() => _onUnlinkPlexServer(config.servers[0].machineId)}
          onClose={() => setIsUnlinkServerModalActive(false)}
        />
      )}

      {isUnlinkAccountModalActive && (
        <UnlinkAccountModal
          onUnlink={() => _onUnlinkPlexAccount()}
          onClose={() => setIsUnlinkAccountModalActive(false)}
        />
      )}
    </div>
  );
};

export { PlexConfig };
