import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../../../shared/enums/FormDefaultValidators";
import { IRadarrConfig } from "../../../../shared/models/IRadarrConfig";
import { IRadarrInstanceInfo } from "../../../../shared/models/IRadarrInstanceInfo";
import { IProviderConfigBase } from "../../../../shared/models/IProviderConfigBase";
import { useRadarrConfig } from "../../../../shared/hooks/useRadarrConfig";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../shared/models/IAsyncCall";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../../shared/components/Button";
import { Spinner } from "../../../../shared/components/Spinner";
import { ComponentSizes } from "../../../../shared/enums/ComponentSizes";
import { PrimaryDivider } from "../../../../shared/components/Divider";
import { Row } from "../../../../shared/components/layout/Row";
import { H1, H2 } from "../../../../shared/components/Titles";
import { InputField } from "../../../../shared/components/inputs/InputField";
import { Checkbox } from "../../../../shared/components/inputs/Checkbox";
import { HelpDanger } from "../../../../shared/components/Help";

export const RadarrConfig = () => {
  const [instanceInfo, setInstanceInfo] = useState<
    IAsyncCall<IRadarrInstanceInfo | null>
  >(DefaultAsyncCall);

  const {
    radarrConfig,
    getRadarrInstanceInfo,
    createRadarrConfig,
    updateRadarrConfig,
  } = useRadarrConfig();

  const [usePort, setUsePort] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    errors,
    setValue,
  } = useForm<IRadarrConfig>();

  useEffect(() => {
    if (radarrConfig.data) {
      reset(radarrConfig.data);
      setUsePort(radarrConfig.data.port !== null);
      getInstanceInfo(radarrConfig.data, false);
    } else {
      setInstanceInfo({ ...DefaultAsyncCall, isLoading: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radarrConfig]);

  useEffect(() => {
    if (!usePort) {
      setValue("port", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePort]);

  const onSubmit = (data: IRadarrConfig) => {
    if (data.port === "") {
      data.port = null;
    }
    if (radarrConfig.data) {
      updateRadarrConfig(radarrConfig.data.id, data);
    } else {
      createRadarrConfig(data);
    }
  };

  const getInstanceInfo = (data: IProviderConfigBase, withAlert: boolean) => {
    if (data.port === "") {
      data.port = null;
    }
    getRadarrInstanceInfo(data, withAlert).then((res) => {
      setInstanceInfo(res);
    });
  };

  return (
    <>
      <form
        id="radarr-config-form"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Row justifyContent="space-between" alignItems="center">
          <H1>Radarr</H1>
          {!instanceInfo.isLoading && instanceInfo.data && (
            <InputField isInline>
              <label>Enabled</label>
              <Checkbox name="enabled" register={register} />
            </InputField>
          )}
          {instanceInfo.isLoading && <Spinner size={ComponentSizes.LARGE} />}
        </Row>
        <br />
        {radarrConfig.isLoading ||
          (instanceInfo.isLoading && <Spinner size={ComponentSizes.LARGE} />)}
        {!radarrConfig.isLoading && !instanceInfo.isLoading && (
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
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </HelpDanger>
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
                  <HelpDanger>
                    {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                  </HelpDanger>
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
        )}

        <PrimaryDivider />

        {instanceInfo.isLoading && <Spinner size={ComponentSizes.LARGE} />}
        {!instanceInfo.isLoading && instanceInfo.data && (
          <div>
            <H2>Requests configurations</H2>
            <br />
            <InputField>
              <label>Version</label>
              <input
                name="version"
                type="text"
                ref={register}
                value={instanceInfo.data ? instanceInfo.data.version : ""}
                disabled={true}
              />
            </InputField>

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

            <br />

            <SecondaryButton type="submit">Save changes</SecondaryButton>
          </div>
        )}
      </form>
    </>
  );
};
