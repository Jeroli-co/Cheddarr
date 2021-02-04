import React, { useContext, useEffect, useState } from "react";
import {
  faEdit,
  faExclamationCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../../../shared/components/layout/Layouts";
import { LinkPlexAccount } from "./components/LinkPlexAccount";
import { ServersModal } from "./components/ServersModal";
import { UnlinkAccountModal } from "./components/UnlinkAccountModal";
import { UnlinkServerModal } from "./components/UnlinkServerModal";
import { PlexConfigContext } from "../../../../contexts/PlexConfigContext";
import { IPlexConfig } from "./models/IPlexConfig";
import { useSession } from "../../../../../shared/contexts/SessionContext";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../shared/enums/FormDefaultValidators";
import { SecondaryButton } from "../../../../../shared/components/Button";
import { SecondarySpinner } from "../../../../../shared/components/Spinner";
import { Sizes } from "../../../../../shared/enums/Sizes";
import { PageLayout } from "../../../../../shared/components/layout/PageLayout";
import { SecondaryDivider } from "../../../../../shared/components/Divider";

const PlexConfig = () => {
  const [isServersModalActive, setIsServersModalActive] = useState(false);
  const [isUnlinkServerModalActive, setIsUnlinkServerModalActive] = useState(
    false
  );
  const [isUnlinkAccountModalActive, setIsUnlinkAccountModalActive] = useState(
    false
  );

  const { handleSubmit, register, errors, reset, setValue } = useForm<
    IPlexConfig
  >();
  const {
    currentConfig,
    createConfig,
    updateConfig,
    deleteConfig,
    isPlexAccountLinked,
  } = useContext(PlexConfigContext);
  const [usePort, setUsePort] = useState(false);

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

  const _onSelectServer = (config: IPlexConfig) => {
    reset(config);
    setUsePort(config.port !== null);
  };

  const _onSubmit = (data: IPlexConfig) => {
    if (data.port === "") {
      data.port = null;
    }
    if (currentConfig.data) {
      let newConfig = { ...currentConfig.data, ...data };
      updateConfig(newConfig);
    } else {
      createConfig(data);
    }
  };

  useEffect(() => {
    if (currentConfig.data) {
      reset(currentConfig.data);
      setUsePort(currentConfig.data.port !== null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConfig]);

  useEffect(() => {
    if (!usePort) {
      setValue("port", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePort]);

  return (
    <PageLayout>
      <RowLayout
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px solid LightGrey"
      >
        <h1 className="is-size-1">Plex</h1>
        <LinkPlexAccount />
      </RowLayout>

      <br />
      <form onSubmit={handleSubmit(_onSubmit)}>
        <h3 className="is-size-3">
          {currentConfig.data ? "Update" : "Add"} plex configuration
        </h3>
        <div className="field">
          <label>Authentication token</label>
          <div className="control">
            <input
              name="apiKey"
              className="input"
              type="text"
              placeholder="API Key"
              ref={register({
                required: true,
              })}
            />
            {errors.apiKey && errors.apiKey.type === "required" && (
              <p className="help is-danger">
                {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
              </p>
            )}
          </div>
        </div>
        <div className="field">
          <label>Hostname or IP Address</label>
          <div className="control">
            <input
              name="host"
              className="input"
              type="text"
              placeholder="Hostname or IP"
              ref={register({
                required: true,
              })}
            />
            {errors.host && errors.host.type === "required" && (
              <p className="help is-danger">
                {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
              </p>
            )}
          </div>
          <p className="help is-warning">
            <FontAwesomeIcon icon={faExclamationCircle} /> Change this value
            with your domain name if you have one
          </p>
        </div>
        <div className="field">
          <label>
            Port{" "}
            <input
              type="checkbox"
              checked={usePort}
              onChange={() => setUsePort(!usePort)}
            />
          </label>
          <div className="control">
            <input
              name="port"
              className="input"
              type="number"
              placeholder="Port"
              ref={register({ minLength: 4, maxLength: 5 })}
              minLength={1000}
              maxLength={99999}
              disabled={!usePort}
            />
          </div>
        </div>
        <div className="field">
          <label>Server ID</label>
          <div className="control">
            <input
              name="serverId"
              className="input"
              type="text"
              placeholder="Server ID"
              ref={register({
                required: true,
              })}
            />
            {errors.serverId && errors.serverId.type === "required" && (
              <p className="help is-danger">
                {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
              </p>
            )}
          </div>
        </div>
        <div className="field">
          <label>Server name</label>
          <div className="control">
            <input
              name="serverName"
              className="input"
              type="text"
              placeholder="Server name"
              ref={register({
                required: true,
              })}
            />
            {errors.serverName && errors.serverName.type === "required" && (
              <p className="help is-danger">
                {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
              </p>
            )}
          </div>
        </div>
        <div className="field">
          <div className="control">
            <input
              id="ssl"
              type="checkbox"
              name="ssl"
              className="switch is-rounded is-small"
              ref={register}
            />
            <label htmlFor="ssl">SSL</label>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <SecondaryButton type="submit">Save</SecondaryButton>
          </div>
        </div>
      </form>

      <SecondaryDivider />

      {isPlexAccountLinked() && (
        <div>
          <h3 className="is-size-3">Current Plex server</h3>
          <br />
          {currentConfig.isLoading && <SecondarySpinner size={Sizes.LARGE} />}
          {!currentConfig.isLoading && !currentConfig.data && (
            <SecondaryButton
              type="button"
              onClick={() => setIsServersModalActive(true)}
            >
              Get account servers
            </SecondaryButton>
          )}

          {!currentConfig.isLoading && currentConfig.data && (
            <RowLayout childMarginRight="20px">
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

          {currentConfig.isLoading && <SecondarySpinner size={Sizes.LARGE} />}

          <SecondaryDivider />

          <div>
            <h3 className="is-size-3">Danger zone</h3>
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
        </div>
      )}

      {isServersModalActive && (
        <ServersModal
          selectServer={_onSelectServer}
          onClose={() => setIsServersModalActive(false)}
        />
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
    </PageLayout>
  );
};

export { PlexConfig };
