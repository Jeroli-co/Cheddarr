import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ServersModal } from "./elements/ServersModal";
import { useForm } from "react-hook-form";
import { SubmitConfig } from "../SubmitConfig";
import { PlexConfigContext } from "../../../../contexts/PlexConfigContext";
import { Spinner } from "../../../../elements/Spinner";
import { RowLayout } from "../../../../elements/layouts";
import { UnlinkServerModal } from "./elements/UnlinkServerModal";
import { UnlinkAccountModal } from "./elements/UnlinkAccountModal";
import { LinkPlexAccount } from "./elements/LinkPlexAccount";

const PlexConfig = ({ location }) => {
  const {
    config,
    updateConfig,
    isPlexAccountLinked,
    isPlexServerLinked,
    unlinkPlexAccount,
  } = useContext(PlexConfigContext);
  const [isServersModalActive, setIsServersModalActive] = useState(false);
  const [isUnlinkServerModalActive, setIsUnlinkServerModalActive] = useState(
    false
  );
  const [isUnlinkAccountModalActive, setIsUnlinkAccountModalActive] = useState(
    false
  );

  const { handleSubmit, formState, reset } = useForm();

  const _onUnlinkPlexServer = () => {
    updateConfig({ machine_name: null, machine_id: null }).then((res) => {
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
    <div className="PlexConfig" data-testid="PlexConfig">
      <RowLayout
        justifyContent="space-between"
        borderBottom="1px solid LightGrey"
      >
        <h1 className="is-size-1">Plex</h1>
        <LinkPlexAccount config={config} location={location} />
      </RowLayout>

      {isPlexAccountLinked(config) && (
        <div className="container">
          <button
            className="button is-primary"
            type="button"
            onClick={() => setIsUnlinkAccountModalActive(true)}
          >
            Unlink Plex Account
          </button>
          <form onSubmit={handleSubmit(_onSubmit)}>
            <br />
            <p className="subtitle is-3">Plex server</p>
            {isPlexServerLinked(config) && (
              <RowLayout justifyContent="space-between" marginTop="2%">
                <p className="is-size-5 has-text-weight-light">
                  {config["machine_name"]}
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
            {!isPlexServerLinked(config) && (
              <RowLayout marginTop="2%">
                <button
                  className="button is-primary"
                  type="button"
                  onClick={() => setIsServersModalActive(true)}
                >
                  Link Plex server
                </button>
              </RowLayout>
            )}
            <SubmitConfig isFormDirty={formState.dirty} />
          </form>
        </div>
      )}

      {isServersModalActive && (
        <ServersModal onClose={() => setIsServersModalActive(false)} />
      )}

      {isUnlinkServerModalActive && (
        <UnlinkServerModal
          machineName={config["machine_name"]}
          onUnlink={() => _onUnlinkPlexServer()}
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
