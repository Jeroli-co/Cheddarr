import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../../shared/models/IAsyncCall";
import { ISonarrInstanceInfo } from "../../../../../shared/models/ISonarrInstanceInfo";
import { useSonarrConfigs } from "../../../../../shared/hooks/useSonarrConfigs";
import { ISonarrConfig } from "../../../../../shared/models/ISonarrConfig";
import { IProviderSettingsBase } from "../../../../../shared/models/IProviderSettingsBase";
import { Input } from "../../../../../shared/components/forms/inputs/Input";
import { Checkbox } from "../../../../../shared/components/forms/inputs/Checkbox";
import { HelpDanger } from "../../../../../shared/components/Help";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../shared/enums/FormDefaultValidators";
import { PrimaryButton } from "../../../../../shared/components/Button";
import { PrimaryLightDivider } from "../../../../../shared/components/Divider";
import { Row } from "../../../../../shared/components/layout/Row";

type SonarrSettingsFormProps = {
  config: ISonarrConfig | null;
};

export const SonarrSettingsForm = (props: SonarrSettingsFormProps) => {
  const [instanceInfo, setInstanceInfo] =
    useState<IAsyncCall<ISonarrInstanceInfo | null>>(DefaultAsyncCall);
  const { getSonarrInstanceInfo } = useSonarrConfigs();
  const [usePort, setUsePort] = useState<boolean>(false);

  const { register, getValues, errors, reset, setValue } =
    useFormContext<ISonarrConfig>();

  const getInstanceInfo = (data: IProviderSettingsBase, withAlert: boolean) => {
    if (data.port === "") {
      data.port = null;
    }
    getSonarrInstanceInfo(data, withAlert).then((res) => setInstanceInfo(res));
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
        tags: props.config ? props.config.tags : [],
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
            <Input isInline={true}>
              <label>Enabled</label>
              <Checkbox name="enabled" register={register} />
            </Input>
            <Input isInline>
              <label>Default</label>
              <Checkbox name="isDefault" register={register} />
            </Input>
          </Row>
          <br />
          <Input>
            <label>Config name</label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              defaultValue="Sonarr"
              ref={register}
            />
          </Input>
        </>
      )}
      <br />
      <Input>
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
      </Input>

      <Row justifyContent="space-between" alignItems="center">
        <Input width="49%">
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
        </Input>

        <Input width="49%">
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
      </Row>

      <Input>
        <label>Version</label>
        <select name="version" ref={register}>
          <option value={3}>3</option>
        </select>
      </Input>

      <br />

      <Input isInline>
        <label>SSL</label>
        <Checkbox name="ssl" register={register} round />
      </Input>

      <br />

      <PrimaryButton
        type="button"
        onClick={() => getInstanceInfo(getValues(), true)}
      >
        Get instance info
      </PrimaryButton>

      {instanceInfo.data && (
        <div>
          <PrimaryLightDivider />

          <Input>
            <label>Default Root Folder</label>
            <select name="rootFolder" ref={register}>
              {instanceInfo.data &&
                instanceInfo.data.rootFolders.map((rf, index) => (
                  <option key={index} value={rf}>
                    {rf}
                  </option>
                ))}
            </select>
          </Input>

          <Input>
            <label>Default Root Folder (Anime)</label>
            <select name="animeRootFolder" ref={register}>
              {instanceInfo.data &&
                instanceInfo.data.rootFolders.map((rf, index) => (
                  <option key={index} value={rf}>
                    {rf}
                  </option>
                ))}
            </select>
          </Input>

          <Input>
            <label>Default Quality Profile</label>
            <select name="qualityProfileId" ref={register}>
              {instanceInfo.data &&
                instanceInfo.data.qualityProfiles.map((p, index) => (
                  <option key={index} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </Input>

          <Input>
            <label>Default Quality Profile (Anime)</label>
            <select name="animeQualityProfileId" ref={register}>
              {instanceInfo.data &&
                instanceInfo.data.qualityProfiles.map((p, index) => (
                  <option key={index} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </Input>

          <Input>
            <label> Default Tags</label>
            <select name="tags" ref={register} multiple>
              {instanceInfo.data &&
                instanceInfo.data.tags.map((t, index) => (
                  <option key={index} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </Input>
          <Input>
            <label> Default Tags (Anime)</label>
            <select name="anime_tags" ref={register} multiple>
              {instanceInfo.data &&
                instanceInfo.data.tags.map((t, index) => (
                  <option key={index} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </Input>
        </div>
      )}
    </>
  );
};
