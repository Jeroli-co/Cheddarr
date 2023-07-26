import React, { useEffect, useState } from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useFormContext } from "react-hook-form";
import { IMediaServerConfig } from "../../../../../shared/models/IMediaServerConfig";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../shared/enums/FormDefaultValidators";
import { Checkbox } from "../../../../../shared/components/forms/inputs/Checkbox";
import { Input } from "../../../../../elements/Input";
import { Help, HelpDanger } from "../../../../../shared/components/Help";
import { Icon } from "../../../../../shared/components/Icon";
import { isEmpty } from "../../../../../utils/strings";

type PlexSettingsFormProps = {
  config: IMediaServerConfig | null;
};

export const PlexSettingsForm = (props: PlexSettingsFormProps) => {
  const { register, errors, reset, setValue } =
    useFormContext<IMediaServerConfig>();
  const [usePort, setUsePort] = useState(false);

  useEffect(() => {
    if (props.config) {
      reset({
        ...props.config,
        name:
          !props.config.name || isEmpty(props.config.name)
            ? "Plex"
            : props.config.name,
      });
      setUsePort(props.config.port !== null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.config]);

  useEffect(() => {
    if (!usePort) {
      setValue("port", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePort]);

  return (
    <>
      {/* Config name */}
      <Input>
        <label>Config name</label>
        <input
          name="name"
          type="text"
          placeholder="Name"
          defaultValue="Plex"
          ref={register}
        />
      </Input>

      {/* Authentication token */}
      <Input>
        <label>Authentication token</label>
        <input
          name="apiKey"
          type="text"
          placeholder="API Key"
          ref={register({
            required: true,
          })}
        />
        {errors.apiKey && errors.apiKey.type === "required" && (
          <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
        )}
      </Input>

      {/* Hostname or IP address */}
      <Input>
        <label>Hostname or IP Address</label>
        <input
          name="host"
          type="text"
          placeholder="Hostname or IP"
          ref={register({
            required: true,
          })}
        />
        {errors.host && errors.host.type === "required" && (
          <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
        )}
        <Help>
          <Icon icon={faExclamationCircle} /> Change this value with your domain
          name if you have one
        </Help>
      </Input>

      {/* PORT */}
      <Input>
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
          type="number"
          placeholder="Port"
          ref={register({ minLength: 4, maxLength: 5 })}
          minLength={1000}
          maxLength={99999}
          disabled={!usePort}
        />
      </Input>

      {/* SERVER ID */}
      <Input>
        <label>Server ID</label>
        <input
          name="serverId"
          type="text"
          placeholder="Server ID"
          ref={register({
            required: true,
          })}
        />
        {errors.serverId && errors.serverId.type === "required" && (
          <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
        )}
      </Input>

      {/* SERVER NAME */}
      <Input>
        <label>Server name</label>
        <input
          name="serverName"
          type="text"
          placeholder="Server name"
          ref={register({
            required: true,
          })}
        />
        {errors.serverName && errors.serverName.type === "required" && (
          <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
        )}
      </Input>

      <Input>
        <label>SSL</label>
        <Checkbox name="ssl" register={register} round />
      </Input>
    </>
  );
};
