import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../../utils/elements/layouts";
import { FORM_DEFAULT_VALIDATOR } from "../../../../utils/enums/FormDefaultValidators";
import { isEmptyObject } from "../../../../utils/objects";
import { IRadarrConfig } from "../../../providers/models/IRadarrConfig";
import { RadarrService } from "../../../providers/services/RadarrService";
import { IRadarrRequestConfig } from "../../../providers/models/IRadarrRequestConfig";

const RadarrConfig = () => {
  const { register, handleSubmit, reset, getValues, errors } = useForm<
    IRadarrConfig
  >();
  const [
    requestsConfig,
    setRequestsConfig,
  ] = useState<IRadarrRequestConfig | null>(null);

  useEffect(() => {
    RadarrService.GetRadarrConfig().then((res) => {
      if (res.error === null) {
        if (!isEmptyObject(res.data)) {
          reset(res.data);
          testConfig(res.data);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: IRadarrConfig) => {
    RadarrService.UpdateRadarrConfig(data).then(() => null);
  };

  const testConfig = (data: IRadarrConfig) => {
    RadarrService.TestRadarrConfig(data).then((res) => {
      if (res.error === null) setRequestsConfig(res.data);
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
          <label className="label">Port Number</label>
          <div className="control">
            <input
              name="port"
              className="input"
              type="text"
              placeholder="Port"
              ref={register}
            />
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
            <button
              type="button"
              className="button is-secondary-button"
              onClick={() => testConfig(getValues())}
            >
              Test
            </button>
          </div>
        </div>
        {requestsConfig && (
          <div>
            <div className="is-divider is-primary" />
            <RowLayout borderBottom="1px solid LightGrey">
              <h3 className="is-size-4">Requests configurations</h3>
            </RowLayout>
            <br />
          </div>
        )}
        <div className="field">
          <label className="label">Version</label>
          <div className="control">
            <input
              name="version"
              className="input"
              type="text"
              ref={register}
              disabled={true}
            />
          </div>
        </div>
        {requestsConfig && (
          <div className="field">
            <label className="label">Default Root Folder</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="rootFolder" ref={register}>
                  {requestsConfig!.rootFolders.map((rf, index) => (
                    <option key={index} value={rf}>
                      {rf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {requestsConfig && (
          <div className="field">
            <label className="label">Default Quality Profile</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="qualityProfileId" ref={register}>
                  {requestsConfig!.qualityProfiles.map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {requestsConfig && (
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
