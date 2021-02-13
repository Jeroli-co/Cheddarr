import React, { useContext, useEffect, useState } from "react";
import {
  faEdit,
  faExclamationCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { LinkPlexAccount } from "./components/LinkPlexAccount";
import { ServersModal } from "./components/ServersModal";
import { UnlinkAccountModal } from "./components/UnlinkAccountModal";
import { UnlinkServerModal } from "./components/UnlinkServerModal";
import { PlexConfigContext } from "../../../../../shared/contexts/PlexConfigContext";
import { IPlexConfig } from "./models/IPlexConfig";
import { useSession } from "../../../../../shared/contexts/SessionContext";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../shared/enums/FormDefaultValidators";
import {
  DangerButton,
  DangerIconButton,
  IconButton,
  PrimaryButton,
  SecondaryButton,
} from "../../../../../shared/components/Button";
import { Spinner } from "../../../../../shared/components/Spinner";
import { ComponentSizes } from "../../../../../shared/enums/ComponentSizes";
import {
  PrimaryDivider,
  SecondaryDivider,
} from "../../../../../shared/components/Divider";
import { Checkbox } from "../../../../../shared/components/inputs/Checkbox";
import { InputField } from "../../../../../shared/components/inputs/InputField";
import { Help } from "../../../../../shared/components/Help";
import { H1, H2, H3 } from "../../../../../shared/components/Titles";
import { Row } from "../../../../../shared/components/layout/Row";
import { Buttons } from "../../../../../shared/components/layout/Buttons";
import { Icon } from "../../../../../shared/components/Icon";

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
    <div>
      <Row justifyContent="space-between" alignItems="center">
        <H1>Plex</H1>
        <LinkPlexAccount />
      </Row>

      <br />

      <form onSubmit={handleSubmit(_onSubmit)}>
        <H2>{currentConfig.data ? "Update" : "Add"} plex server</H2>

        {/* Authentication token */}
        <InputField>
          <label>Authentication token</label>
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
        </InputField>

        <Row justifyContent="space-between">
          {/* Hostname or IP address */}
          <InputField width="49%">
            <label>Hostname or IP Address</label>
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
            <Help>
              <Icon icon={faExclamationCircle} /> Change this value with your
              domain name if you have one
            </Help>
          </InputField>

          {/* PORT */}
          <InputField width="49%">
            <label>
              Port{" "}
              <input
                type="checkbox"
                checked={usePort}
                onChange={() => setUsePort(!usePort)}
              />
            </label>
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
          </InputField>
        </Row>

        <Row justifyContent="space-between">
          {/* SERVER ID */}
          <InputField width="49%">
            <label>Server ID</label>
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
          </InputField>

          {/* SERVER NAME */}
          <InputField width="49%">
            <label>Server name</label>
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
          </InputField>
        </Row>

        <InputField>
          <label>SSL</label>
          <Checkbox name="ssl" register={register} round />
        </InputField>

        <br />

        <SecondaryButton type="submit">Save</SecondaryButton>
      </form>

      <PrimaryDivider />

      {isPlexAccountLinked() && (
        <div>
          <H2>Current Plex server</H2>
          <br />
          {currentConfig.isLoading && <Spinner size={ComponentSizes.LARGE} />}
          {!currentConfig.isLoading && !currentConfig.data && (
            <PrimaryButton
              type="button"
              onClick={() => setIsServersModalActive(true)}
            >
              Get account servers
            </PrimaryButton>
          )}

          {!currentConfig.isLoading && currentConfig.data && (
            <>
              <H3>{currentConfig.data.serverName}</H3>
              <Buttons>
                <IconButton
                  type="button"
                  onClick={() => setIsServersModalActive(true)}
                >
                  <Icon icon={faEdit} />
                </IconButton>
                <DangerIconButton
                  type="button"
                  onClick={() => setIsUnlinkServerModalActive(true)}
                >
                  <Icon icon={faTrash} />
                </DangerIconButton>
              </Buttons>
            </>
          )}

          {currentConfig.isLoading && <Spinner size={ComponentSizes.LARGE} />}

          <SecondaryDivider />

          <div>
            <H2>Danger zone</H2>
            <div className="content">
              <Help>
                <Icon icon={faExclamationCircle} /> Be careful with that option
              </Help>
              <DangerButton
                type="button"
                onClick={() => setIsUnlinkAccountModalActive(true)}
              >
                Unlink Plex Account
              </DangerButton>
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
    </div>
  );
};

export { PlexConfig };
