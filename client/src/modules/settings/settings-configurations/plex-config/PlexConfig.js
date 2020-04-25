import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../../contexts/AuthContext";
import { ServersModal } from "./elements/ServersModal";
import { useForm } from "react-hook-form";
import { SubmitPlexConfig } from "./elements/SubmitPlexConfig";
import { PlexConfigContext } from "../../../../contexts/PlexConfigContext";
import { Spinner } from "../../../../elements/Spinner";
import { RowLayout } from "../../../../elements/layouts";
import { UnlinkServerModal } from "./elements/UnlinkServerModal";

const isPlexAccountLinked = (config) => {
  return (
    config["provider_api_key"] !== null &&
    typeof config["provider_api_key"] !== "undefined"
  );
};

const isPlexServerLinked = (config) => {
  return (
    config["machine_name"] !== null &&
    typeof config["machine_name"] !== "undefined"
  );
};

const LinkPlexAccount = ({ config, location }) => {
  const { signInWithPlex } = useContext(AuthContext);

  if (!isPlexAccountLinked(config)) {
    return (
      <button
        className="button is-primary"
        type="button"
        onClick={() => signInWithPlex(location.pathname)}
      >
        Link Plex account
      </button>
    );
  }

  return (
    <p className="is-size-5 is-size-7-mobile has-text-weight-light">
      <FontAwesomeIcon className="has-text-success" icon={faCheck} /> Plex
      account linked
    </p>
  );
};

const PlexConfig = ({ location }) => {
  const { config, updateConfig } = useContext(PlexConfigContext);
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

                {isUnlinkServerModalActive && (
                  <UnlinkServerModal
                    machineName={config["machine_name"]}
                    onUnlink={() => _onUnlinkPlexServer()}
                    onClose={() => setIsUnlinkServerModalActive(false)}
                  />
                )}
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

          {isServersModalActive && (
            <ServersModal onClose={() => setIsServersModalActive(false)} />
          )}
        </div>
      )}
    </div>
  );
};

export { PlexConfig };
