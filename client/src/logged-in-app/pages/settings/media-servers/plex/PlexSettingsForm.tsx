import React, { ChangeEvent, useEffect, useState } from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useFormContext } from "react-hook-form";
import {
  IMediaServerConfig,
  IMediaServerLibrary,
} from "../../../../../shared/models/IMediaServerConfig";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../shared/enums/FormDefaultValidators";
import { Checkbox } from "../../../../../shared/components/inputs/Checkbox";
import { InputField } from "../../../../../shared/components/inputs/InputField";
import { Help, HelpDanger } from "../../../../../shared/components/Help";
import { Icon } from "../../../../../shared/components/Icon";
import { useMediaServerLibrariesService } from "../../../../../shared/hooks/useMediaServerLibrariesService";
import { H3 } from "../../../../../shared/components/Titles";
import { Spinner } from "../../../../../shared/components/Spinner";
import { PrimaryButton } from "../../../../../shared/components/Button";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../../shared/models/IAsyncCall";
import { isEmpty } from "../../../../../utils/strings";
import { useAlert } from "../../../../../shared/contexts/AlertContext";
import { useTypedController } from "@hookform/strictly-typed";
import { MediaServerTypes } from "../../../../../shared/enums/MediaServersTypes";

type PlexSettingsFormProps = {
  config: IMediaServerConfig | null;
};

export const PlexSettingsForm = (props: PlexSettingsFormProps) => {
  const { register, errors, reset, setValue, watch, control } = useFormContext<
    IMediaServerConfig
  >();
  const TypedController = useTypedController<IMediaServerConfig>({ control });
  const [usePort, setUsePort] = useState(false);
  const serverId = watch("serverId", undefined);
  const { fetchLibraries } = useMediaServerLibrariesService(
    MediaServerTypes.PLEX
  );
  const [plexLibraries, setPlexLibraries] = useState<
    IAsyncCall<IMediaServerLibrary[] | null>
  >({ ...DefaultAsyncCall, isLoading: false });
  const { pushDanger } = useAlert();

  const onSyncLibraries = () => {
    if (!isEmpty(serverId)) {
      fetchLibraries(serverId).then((res) => setPlexLibraries(res));
    } else {
      pushDanger("No server id provided");
    }
  };

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
      setPlexLibraries({ ...DefaultAsyncCall, isLoading: false });
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
          defaultValue="Plex"
          ref={register}
        />
      </InputField>

      {/* Authentication token */}
      <InputField>
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
      </InputField>

      {/* Hostname or IP address */}
      <InputField>
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

      <H3>Libraries</H3>
      {plexLibraries.isLoading && <Spinner />}
      {!plexLibraries.isLoading && !plexLibraries.data && (
        <PrimaryButton type="button" onClick={() => onSyncLibraries()}>
          Sync libraries
        </PrimaryButton>
      )}
      {!plexLibraries.isLoading &&
        plexLibraries.data &&
        plexLibraries.data.map((l, index) => {
          return (
            <span key={index}>
              <TypedController
                name={["libraries", index, "enabled"]}
                defaultValue={l.enabled}
                render={({ onChange, value }) => (
                  <InputField isInline>
                    <Checkbox
                      round
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onChange(e.target.checked)
                      }
                      checked={value}
                    />
                    <label>{l.name}</label>
                  </InputField>
                )}
              />

              <TypedController
                name={["libraries", index, "name"]}
                defaultValue={l.name}
                render={() => (
                  <InputField hidden>
                    <input type="text" value={l.name} onChange={() => {}} />
                  </InputField>
                )}
              />

              <TypedController
                name={["libraries", index, "libraryId"]}
                defaultValue={l.libraryId}
                render={({ onChange, value, ...rest }) => (
                  <InputField hidden>
                    <input
                      type="number"
                      value={l.libraryId}
                      onChange={() => {}}
                    />
                  </InputField>
                )}
              />
            </span>
          );
        })}
    </>
  );
};
