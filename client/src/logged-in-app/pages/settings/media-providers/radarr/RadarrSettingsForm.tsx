import React, { useEffect, useState } from "react";
import { Row } from "../../../../../shared/components/layout/Row";
import { InputField } from "../../../../../shared/components/inputs/InputField";
import { Checkbox } from "../../../../../shared/components/inputs/Checkbox";
import { HelpDanger } from "../../../../../shared/components/Help";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../shared/enums/FormDefaultValidators";
import { PrimaryButton } from "../../../../../shared/components/Button";
import { PrimaryLightDivider } from "../../../../../shared/components/Divider";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../../shared/models/IAsyncCall";
import { IRadarrInstanceInfo } from "../../../../../shared/models/IRadarrInstanceInfo";
import { useFormContext } from "react-hook-form";
import { IProviderSettingsBase } from "../../../../../shared/models/IProviderSettingsBase";
import { IRadarrConfig } from "../../../../../shared/models/IRadarrConfig";
import { useRadarrConfigsContext } from "../../../../../shared/contexts/RadarrConfigsContext";

type RadarrSettingsFormProps = {
  config: IRadarrConfig | null;
};

export const RadarrSettingsForm = (props: RadarrSettingsFormProps) => {
  const [instanceInfo, setInstanceInfo] = useState<
    IAsyncCall<IRadarrInstanceInfo | null>
  >(DefaultAsyncCall);
  const { register, errors, reset, getValues, setValue } = useFormContext<
    IRadarrConfig
  >();
  const [usePort, setUsePort] = useState(false);
  const { getRadarrInstanceInfo } = useRadarrConfigsContext();

  const getInstanceInfo = (data: IProviderSettingsBase, withAlert: boolean) => {
    if (data.port === "") {
      data.port = null;
    }
    getRadarrInstanceInfo(data, withAlert).then((res) => {
      setInstanceInfo(res);
    });
  };

  useEffect(() => {
    if (props.config) {
      reset(props.config);
      setUsePort(props.config.port !== null);
      getInstanceInfo({ ...props.config }, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.config]);

  useEffect(() => {
    if (instanceInfo.data) {
      reset({
        ...getValues(),
        ...instanceInfo.data,
        enabled: props.config ? props.config.enabled : true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceInfo]);

  useEffect(() => {
    if (!usePort) {
      setValue("port", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePort]);

  return (
    <>
      {instanceInfo.data && (
        <>
          <Row alignItems="center">
            <InputField isInline>
              <label>Enabled</label>
              <Checkbox name="enabled" register={register} />
            </InputField>
            <InputField isInline>
              <label>Default</label>
              <Checkbox name="isDefault" register={register} />
            </InputField>
          </Row>
          <br />
          <InputField>
            <label>Config name</label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              defaultValue="Radarr"
              ref={register}
            />
          </InputField>
        </>
      )}
      <div>
        <InputField>
          <label>API Key</label>
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

        <Row justifyContent="space-between" alignItems="center">
          <InputField width="49%">
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
          </InputField>

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
              type="number"
              placeholder="Port"
              ref={register({ minLength: 4, maxLength: 5 })}
              minLength={1000}
              maxLength={99999}
              disabled={!usePort}
            />
          </InputField>
        </Row>

        <InputField>
          <label>Version</label>
          <select name="version" ref={register}>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </InputField>

        <br />

        <InputField isInline={true}>
          <label>SSL</label>
          <Checkbox name="ssl" register={register} round />
        </InputField>

        <br />

        <PrimaryButton
          type="button"
          onClick={() => getInstanceInfo(getValues(), true)}
        >
          Get instance info
        </PrimaryButton>
      </div>

      {instanceInfo.data && (
        <div>
          <PrimaryLightDivider />

          <InputField>
            <label>Default Root Folder</label>
            <select name="rootFolder" ref={register}>
              {instanceInfo.data &&
                instanceInfo.data.rootFolders.map((rf, index) => (
                  <option key={index} value={rf}>
                    {rf}
                  </option>
                ))}
            </select>
          </InputField>

          <InputField>
            <label>Default Quality Profile</label>
            <select name="qualityProfileId" ref={register}>
              {instanceInfo.data.qualityProfiles.map((p, index) => (
                <option key={index} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </InputField>
        </div>
      )}
    </>
  );
};
