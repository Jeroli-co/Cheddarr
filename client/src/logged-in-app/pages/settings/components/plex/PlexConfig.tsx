import React, { useContext, useState } from "react";
import {
  faEdit,
  faExclamationCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../../../shared/components/Layouts";
import { SubmitConfig } from "../../../../../experimentals/SubmitConfig";
import { LinkPlexAccount } from "./components/LinkPlexAccount";
import { ServersModal } from "./components/ServersModal";
import { UnlinkAccountModal } from "./components/UnlinkAccountModal";
import { UnlinkServerModal } from "./components/UnlinkServerModal";
import { PlexConfigContext } from "../../../../contexts/PlexConfigContext";
import { IPlexConfig } from "./models/IPlexConfig";
import { useSession } from "../../../../../shared/contexts/SessionContext";

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

  const { unlinkPlexAccount } = useSession();

  const _onUnlinkPlexConfig = (id: string) => {
    deleteConfig(id).then((res) => {
      if (res.status === 200) setIsUnlinkServerModalActive(false);
    });
  };

  const _onUnlinkPlexAccount = () => {
    unlinkPlexAccount();
    setIsUnlinkAccountModalActive(false);
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
          {!currentConfig.data && isPlexAccountLinked() && (
            <button
              className="button is-primary"
              type="button"
              onClick={() => setIsServersModalActive(true)}
            >
              Link Plex server
            </button>
          )}
          {currentConfig.data && isPlexAccountLinked() && (
            <RowLayout justifyContent="space-between" marginTop="2%">
              <p className="is-size-5 has-text-weight-light">
                {currentConfig.data.serverName}
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

      {isUnlinkServerModalActive && currentConfig.data && (
        <UnlinkServerModal
          serverName={currentConfig.data.serverName}
          onUnlink={() =>
            currentConfig.data ? _onUnlinkPlexConfig(currentConfig.data.id) : {}
          }
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
