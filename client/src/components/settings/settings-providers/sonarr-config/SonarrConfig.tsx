import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../elements/layouts";
import { FORM_DEFAULT_VALIDATOR } from "../../../../enums/FormDefaultValidators";
import { ISonarrConfig } from "../../../../models/ISonarrConfig";
import { SonarrService } from "../../../../services/SonarrService";
import { NotificationContext } from "../../../../contexts/notifications/NotificationContext";
import { ISonarrInstanceInfo } from "../../../../models/ISonarrInstanceInfo";
import { IProviderConfigBase } from "../../../../models/IProviderConfigBase";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../../../../models/IAsyncResponse";

const SonarrConfig = () => {
  const [instanceInfo, setInstanceInfo] = useState<ISonarrInstanceInfo | null>(
    null
  );
  const [sonarrConfig, setSonarrConfig] = useState<ISonarrConfig | null>(null);
  const [usePort, setUsePort] = useState<boolean>(false);

  const { register, handleSubmit, getValues, errors, reset } = useForm<
    ISonarrConfig
  >();

  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  useEffect(() => {
    SonarrService.GetSonarrConfig().then((res) => {
      if (res.error === null) {
        setSonarrConfig(res.data[0]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sonarrConfig) {
      reset(sonarrConfig);
      setUsePort(sonarrConfig.port !== null);
    }
  }, [sonarrConfig]);

  const getInstanceInfo = (data: IProviderConfigBase) => {
    SonarrService.GetSonarrInstanceInfo(data).then((res) => {
      if (res.error === null) {
        setInstanceInfo(res.data);
        pushSuccess("Test successful");
      } else {
        pushDanger("Cannot connect to sonarr");
      }
    });
  };

  const onSubmit = (data: ISonarrConfig) => {
    const handleRes = (
      res: AsyncResponseSuccess<ISonarrConfig> | AsyncResponseError
    ) => {
      if (res.error === null) {
        setSonarrConfig(res.data);
        pushSuccess(res.message);
      }
    };

    if (sonarrConfig) {
      SonarrService.UpdateSonarrConfig(sonarrConfig.id, data).then((res) => {
        handleRes(res);
      });
    } else {
      SonarrService.AddSonarrConfig(data).then((res) => {
        handleRes(res);
      });
    }
  };

  const isVersionThree = () => {
    return instanceInfo && instanceInfo.version.toString().startsWith("3");
  };

  return (
    <div className="SonarrConfig" data-testid="SonarrConfig">
      <RowLayout borderBottom="1px solid LightGrey">
        <h1 className="is-size-1">Sonarr</h1>
      </RowLayout>
      <br />
      <form
        id="radarr-config-form"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        {sonarrConfig && (
          <div className="field">
            <div className="control">
              <input
                id="enabled"
                type="checkbox"
                name="enabled"
                className="switch is-primary"
                ref={register}
              />
              <label htmlFor="enabled">Enabled</label>
            </div>
          </div>
        )}
        <div className="field">
          <label className="label">API Key</label>
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
          <label className="label">Hostname or IP Address</label>
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
        </div>
        <div className="field">
          <label className="label">
            Port{" "}
            <input
              type="checkbox"
              checked={usePort}
              onChange={() => setUsePort(!usePort)}
            />
          </label>
          {usePort && (
            <div className="control">
              <input
                name="port"
                className="input"
                type="number"
                placeholder="Port"
                ref={register({ minLength: 4, maxLength: 5 })}
                minLength={1000}
                maxLength={99999}
              />
            </div>
          )}
          {!usePort && <p>Check the box to set a port value</p>}
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
            <button
              type="button"
              className="button is-secondary-button"
              onClick={() => getInstanceInfo(getValues())}
            >
              Get instance info
            </button>
          </div>
        </div>
        {instanceInfo && (
          <div>
            <div className="is-divider is-primary" />
            <RowLayout borderBottom="1px solid LightGrey">
              <h3 className="is-size-4">Requests configurations</h3>
            </RowLayout>
            <br />
          </div>
        )}
        {instanceInfo && (
          <div className="field">
            <label className="label">Version</label>
            <div className="control">
              <input
                name="version"
                className="input"
                type="text"
                ref={register}
                value={
                  sonarrConfig
                    ? sonarrConfig.version
                    : instanceInfo
                    ? instanceInfo.version
                    : ""
                }
                disabled={true}
              />
            </div>
          </div>
        )}
        {instanceInfo && (
          <div className="field">
            <label className="label">Default Root Folder</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="rootFolder" ref={register}>
                  {instanceInfo!.rootFolders.map((rf, index) => (
                    <option key={index} value={rf}>
                      {rf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {instanceInfo && (
          <div className="field">
            <label className="label">Default Root Folder (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="animeRootFolder" ref={register}>
                  {instanceInfo!.rootFolders.map((rf, index) => (
                    <option key={index} value={rf}>
                      {rf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {instanceInfo && (
          <div className="field">
            <label className="label">Default Quality Profile</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="qualityProfileId" ref={register}>
                  {instanceInfo!.qualityProfiles.map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {instanceInfo && (
          <div className="field">
            <label className="label">Default Quality Profile (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="animeQualityProfileId" ref={register}>
                  {instanceInfo!.qualityProfiles.map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {instanceInfo && isVersionThree() && (
          <div className="field">
            <label className="label">Default Language Profile</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="languageProfileId" ref={register}>
                  {instanceInfo!.languageProfiles.map((l, index) => (
                    <option key={index} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {instanceInfo && isVersionThree() && (
          <div className="field">
            <label className="label">Default Language Profile (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="animeLanguageProfileId" ref={register}>
                  {instanceInfo!.languageProfiles.map((l, index) => (
                    <option key={index} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {instanceInfo && (
          <div className="field">
            <div className="control">
              <button
                type="submit"
                className="button is-primary is-outlined is-fullwidth"
              >
                Save changes
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export { SonarrConfig };
