import {
  faEdit,
  faExclamationCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { PlexConfigContext } from "../../../../contexts/PlexConfigContext";
import { RowLayout } from "../../../../elements/layouts";
import { Spinner } from "../../../../elements/Spinner";
import { SubmitConfig } from "../SubmitConfig";
import { LinkPlexAccount } from "./elements/LinkPlexAccount";
import { ServersModal } from "./elements/ServersModal";
import { UnlinkAccountModal } from "./elements/UnlinkAccountModal";
import { UnlinkServerModal } from "./elements/UnlinkServerModal";

const PlexConfig = ({ location }) => {
  const {
    config,
    updateConfig,
    isPlexAccountLinked,
    isPlexServerLinked,
    unlinkPlexAccount,
    removePlexServer,
  } = useContext(PlexConfigContext);
  const [isServersModalActive, setIsServersModalActive] = useState(false);
  const [isUnlinkServerModalActive, setIsUnlinkServerModalActive] = useState(
    false
  );
  const [isUnlinkAccountModalActive, setIsUnlinkAccountModalActive] = useState(
    false
  );

  const { handleSubmit, formState, reset } = useForm();

  const _onUnlinkPlexServer = (machine_id) => {
    removePlexServer(machine_id).then((res) => {
      if (res) setIsUnlinkServerModalActive(false);
    });
  };

  const _onUnlinkPlexAccount = () => {
    unlinkPlexAccount().then((res) => {
      if (res) setIsUnlinkAccountModalActive(false);
    });
  };

  const _onSubmit = (data) => {
    let newConfig = {};
    formState.dirtyFields.forEach((key) => {
      newConfig[key] = data[key];
    });
    updateConfig(newConfig).then((res) => {
      if (res) reset();
    });
  };

  if (!config) return <Spinner color="primary" size="3x" />;

  return (
    <div className="PlexConfig container" data-testid="PlexConfig">
      <RowLayout
        justifyContent="space-between"
        borderBottom="1px solid LightGrey"
      >
        <h1 className="is-size-1">Plex</h1>
        <LinkPlexAccount config={config} location={location} />
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
          onUnlink={() => _onUnlinkPlexServer(config.servers[0]["machine_id"])}
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
