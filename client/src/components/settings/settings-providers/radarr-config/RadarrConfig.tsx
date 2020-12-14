import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../elements/layouts";
import { FORM_DEFAULT_VALIDATOR } from "../../../../enums/FormDefaultValidators";
import { IRadarrConfig } from "../../../../models/IRadarrConfig";
import { RadarrService } from "../../../../services/RadarrService";
import { IRadarrInstanceInfo } from "../../../../models/IRadarrInstanceInfo";
import { NotificationContext } from "../../../../contexts/notifications/NotificationContext";
import { IProviderConfigBase } from "../../../../models/IProviderConfigBase";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../../../../models/IAsyncResponse";

const RadarrConfig = () => {
  const [instanceInfo, setInstanceInfo] = useState<IRadarrInstanceInfo | null>(
    null
  );

  const [radarrConfig, setRadarrConfig] = useState<IRadarrConfig | null>(null);

  const [usePort, setUsePort] = useState<boolean>(false);

  const { register, handleSubmit, reset, getValues, errors } = useForm<
    IRadarrConfig
  >();

  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  useEffect(() => {
    RadarrService.GetRadarrConfig().then((res) => {
      if (res.error === null) {
        setRadarrConfig(res.data[0]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (radarrConfig) {
      reset(radarrConfig);
      setUsePort(radarrConfig.port !== null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radarrConfig]);

  const onSubmit = (data: IRadarrConfig) => {
    const handleRes = (
      res: AsyncResponseSuccess<IRadarrConfig> | AsyncResponseError
    ) => {
      if (res.error === null) {
        setRadarrConfig(res.data);
        pushSuccess(res.message);
      }
    };

    if (radarrConfig) {
      RadarrService.UpdateRadarrConfig(radarrConfig.id, data).then((res) => {
        handleRes(res);
      });
    } else {
      RadarrService.AddRadarrConfig(data).then((res) => {
        handleRes(res);
      });
    }
  };

  const getInstanceInfo = (data: IProviderConfigBase) => {
    RadarrService.GetRadarrInstanceInfo(data).then((res) => {
      if (res.error === null) {
        setInstanceInfo(res.data);
        pushSuccess("Test successful");
      } else {
        pushDanger("Cannot connect to radarr");
      }
    });
  };

  return (
    <div className="RadarrConfig" data-testid="RadarrConfig">
      <RowLayout borderBottom="1px solid LightGrey">
        <h1 className="is-size-1">Radarr</h1>
      </RowLayout>
      <br />
      <form
        id="radarr-config-form"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        {radarrConfig && (
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
                  radarrConfig
                    ? radarrConfig.version
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

export { RadarrConfig };
