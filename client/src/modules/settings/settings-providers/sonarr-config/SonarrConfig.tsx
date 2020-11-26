import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../../utils/elements/layouts";
import { FORM_DEFAULT_VALIDATOR } from "../../../../utils/enums/FormDefaultValidators";
import { isEmptyObject } from "../../../../utils/objects";
import { ISonarrConfig } from "../../../providers/models/ISonarrConfig";
import { SonarrService } from "../../../providers/services/SonarrService";
import { ISonarrRequestConfig } from "../../../providers/models/ISonarrRequestConfig";

const SonarrConfig = () => {
  const { register, handleSubmit, reset, getValues, errors, watch } = useForm<
    ISonarrConfig
  >();
  const [
    requestsConfig,
    setRequestsConfig,
  ] = useState<ISonarrRequestConfig | null>(null);
  const version = watch("version");

  useEffect(() => {
    SonarrService.GetSonarrConfig().then((res) => {
      if (res.error === null) {
        if (!isEmptyObject(res.data)) {
          reset(res.data);
          testConfig(res.data);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: ISonarrConfig) => {
    SonarrService.UpdateSonarrConfig(data).then(() => null);
  };

  const testConfig = (data: ISonarrConfig) => {
    SonarrService.TestSonarrConfig(data).then((res) => {
      if (res.error === null) setRequestsConfig(res.data);
    });
  };

  const isVersionThree = () => {
    return version.startsWith("3");
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
            <label className="label">Default Root Folder (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="animeRootFolder" ref={register}>
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
            <label className="label">Default Quality Profile (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="animeQualityProfileId" ref={register}>
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
        {requestsConfig && isVersionThree() && (
          <div className="field">
            <label className="label">Default Language Profile</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="languageProfileId" ref={register}>
                  {requestsConfig!.languageProfiles.map((l, index) => (
                    <option key={index} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {requestsConfig && isVersionThree() && (
          <div className="field">
            <label className="label">Default Language Profile (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="animeLanguageProfileId" ref={register}>
                  {requestsConfig!.languageProfiles.map((l, index) => (
                    <option key={index} value={l.id}>
                      {l.name}
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

export { SonarrConfig };
