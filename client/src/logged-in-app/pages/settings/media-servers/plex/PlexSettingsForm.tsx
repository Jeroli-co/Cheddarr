import React, { useEffect, useState } from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useFormContext } from "react-hook-form";
import { IPlexSettings } from "../../../../../shared/models/IPlexSettings";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../shared/enums/FormDefaultValidators";
import { Checkbox } from "../../../../../shared/components/inputs/Checkbox";
import { InputField } from "../../../../../shared/components/inputs/InputField";
import { Help, HelpDanger } from "../../../../../shared/components/Help";
import { Icon } from "../../../../../shared/components/Icon";

type PlexSettingsFormProps = {
  config: IPlexSettings | null;
};

export const PlexSettingsForm = (props: PlexSettingsFormProps) => {
  const { register, errors, reset, setValue } = useFormContext<IPlexSettings>();
  const [usePort, setUsePort] = useState(false);

  useEffect(() => {
    if (props.config) {
      reset(props.config);
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
      <InputField>
        <label>Config name</label>
        <input
          name="name"
          type="text"
          placeholder="Name"
          ref={register({
            required: true,
          })}
        />
      </InputField>

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
          <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
        )}
      </InputField>

      {/* Hostname or IP address */}
      <InputField>
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
          <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
        )}
        <Help>
          <Icon icon={faExclamationCircle} /> Change this value with your domain
          name if you have one
        </Help>
      </InputField>

      {/* PORT */}
      <InputField>
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

      {/* SERVER ID */}
      <InputField>
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
          <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
        )}
      </InputField>

      {/* SERVER NAME */}
      <InputField>
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
          <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
        )}
      </InputField>

      <InputField>
        <label>SSL</label>
        <Checkbox name="ssl" register={register} round />
      </InputField>
    </>
  );
};
