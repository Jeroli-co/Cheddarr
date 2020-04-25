import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ServersModal } from "./elements/ServersModal";
import { useForm } from "react-hook-form";
import { SubmitPlexConfig } from "./elements/SubmitPlexConfig";
import { PlexConfigContext } from "../../../../contexts/PlexConfigContext";
import { Spinner } from "../../../../elements/Spinner";
import { RowLayout } from "../../../../elements/layouts";
import { UnlinkServerModal } from "./elements/UnlinkServerModal";
import { LinkPlexAccount } from "./elements/LinkPlexAccount";

const PlexConfig = ({ location }) => {
  const {
    config,
    updateConfig,
    isPlexAccountLinked,
    isPlexServerLinked,
  } = useContext(PlexConfigContext);
  const [isServersModalActive, setIsServersModalActive] = useState(false);
  const [isUnlinkServerModalActive, setIsUnlinkServerModalActive] = useState(
    false
  );

  const { register, handleSubmit, formState, reset } = useForm();

  const _onUnlinkPlexServer = () => {
    updateConfig({ machine_name: null }).then((res) => {
      if (res) setIsUnlinkServerModalActive(false);
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
          <form onSubmit={handleSubmit(_onSubmit)}>
            {isPlexServerLinked(config) && (
              <RowLayout justifyContent="space-between" marginTop="2%">
                <p className="is-size-4">Plex server</p>
                <p className="is-size-5 has-text-weight-light">
                  {config["machine_name"]}
                </p>
                <button
                  type="button"
                  className="button is-small is-rounded is-info"
                  onClick={() => setIsServersModalActive(true)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  type="button"
                  className="button is-small is-rounded is-danger"
                  onClick={() => setIsUnlinkServerModalActive(true)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <div className="field">
                  <div className="control">
                    <input
                      id="enabled"
                      type="checkbox"
                      name="enabled"
                      className="switch is-primary"
                      ref={register}
                      defaultChecked={config.enabled}
                    />
                    <label htmlFor="enabled">Enabled</label>
                  </div>
                </div>
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
            <SubmitPlexConfig isFormDirty={formState.dirty} />
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
    </div>
  );
};

export { PlexConfig };
