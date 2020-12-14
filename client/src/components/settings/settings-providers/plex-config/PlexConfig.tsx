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
import { PlexConfigContext } from "../../../../contexts/plex-config/PlexConfigContext";
import { IPlexConfig } from "../../../../models/IPlexConfig";
import { AuthContext } from "../../../../contexts/auth/AuthContext";

const PlexConfig = () => {
  const [isServersModalActive, setIsServersModalActive] = useState(false);
  const [isUnlinkServerModalActive, setIsUnlinkServerModalActive] = useState(
    false
  );
  const [isUnlinkAccountModalActive, setIsUnlinkAccountModalActive] = useState(
    false
  );

  const { handleSubmit, formState } = useForm<IPlexConfig>();
  const {
    currentConfig,
    updateConfig,
    deleteConfig,
    isPlexAccountLinked,
  } = useContext(PlexConfigContext);

  const { unlinkPlexAccount } = useContext(AuthContext);

  const _onUnlinkPlexConfig = (id: string) => {
    deleteConfig(id).then((res) => {
      if (res.error === null) setIsUnlinkServerModalActive(false);
    });
  };

  const _onUnlinkPlexAccount = () => {
    unlinkPlexAccount().then((res) => {
      if (res.error === null) setIsUnlinkAccountModalActive(false);
    });
  };

  const _onSubmit = (data: IPlexConfig) => {
    updateConfig(data);
  };

  return (
    <div className="PlexConfig" data-testid="PlexConfig">
      <RowLayout
        justifyContent="space-between"
        borderBottom="1px solid LightGrey"
      >
        <h1 className="is-size-1">Plex</h1>
        <LinkPlexAccount />
      </RowLayout>

      <div>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <br />
          {isPlexAccountLinked() && (
            <p className="subtitle is-3">Plex server</p>
          )}
          {!currentConfig && isPlexAccountLinked() && (
            <button
              className="button is-primary"
              type="button"
              onClick={() => setIsServersModalActive(true)}
            >
              Link Plex server
            </button>
          )}
          {currentConfig && isPlexAccountLinked() && (
            <RowLayout justifyContent="space-between" marginTop="2%">
              <p className="is-size-5 has-text-weight-light">
                {currentConfig.serverName}
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
          <SubmitConfig isFormDirty={formState.dirty} />
        </form>
        <hr />
        {isPlexAccountLinked() && (
          <div>
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
      </div>

      {isServersModalActive && (
        <ServersModal onClose={() => setIsServersModalActive(false)} />
      )}

      {isUnlinkServerModalActive && currentConfig && (
        <UnlinkServerModal
          serverName={currentConfig.serverName}
          onUnlink={() => _onUnlinkPlexConfig(currentConfig?.id)}
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
