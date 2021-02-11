import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../../shared/components/layout/Layouts";
import { FORM_DEFAULT_VALIDATOR } from "../../../../shared/enums/FormDefaultValidators";
import { ISonarrConfig } from "../models/ISonarrConfig";
import { ISonarrInstanceInfo } from "../models/ISonarrInstanceInfo";
import { IProviderConfigBase } from "../models/IProviderConfigBase";
import { useSonarrConfig } from "../../../hooks/useSonarrConfig";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../shared/models/IAsyncCall";
import { SecondaryButton } from "../../../../shared/components/Button";
import { SecondaryDivider } from "../../../../shared/components/Divider";
import { Spinner } from "../../../../shared/components/Spinner";
import { Sizes } from "../../../../shared/enums/Sizes";

export const SonarrConfig = () => {
  const [instanceInfo, setInstanceInfo] = useState<
    IAsyncCall<ISonarrInstanceInfo | null>
  >(DefaultAsyncCall);
  const {
    currentSonarrConfig,
    getSonarrInstanceInfo,
    createSonarrConfig,
    updateSonarrConfig,
  } = useSonarrConfig();
  const [usePort, setUsePort] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    getValues,
    errors,
    reset,
    setValue,
  } = useForm<ISonarrConfig>();

  const getInstanceInfo = (data: IProviderConfigBase, withAlert: boolean) => {
    if (data.port === "") {
      data.port = null;
    }
    getSonarrInstanceInfo(data, withAlert).then((res) => setInstanceInfo(res));
  };

  const onSubmit = (data: ISonarrConfig) => {
    if (data.port === "") {
      data.port = null;
    }
    if (currentSonarrConfig.data) {
      updateSonarrConfig(currentSonarrConfig.data.id, data);
    } else {
      createSonarrConfig(data);
    }
  };

  const isVersionThree = () => {
    return (
      instanceInfo.data && instanceInfo.data.version.toString().startsWith("3")
    );
  };

  useEffect(() => {
    if (currentSonarrConfig.data) {
      reset(currentSonarrConfig.data);
      setUsePort(currentSonarrConfig.data.port !== null);
      getInstanceInfo(currentSonarrConfig.data, false);
    } else {
      setInstanceInfo({ ...DefaultAsyncCall, isLoading: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSonarrConfig]);

  useEffect(() => {
    if (!usePort) {
      setValue("port", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePort]);

  return (
    <form
      id="radarr-config-form"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <RowLayout
        borderBottom="1px solid LightGrey"
        justifyContent="space-between"
        alignItems="center"
      >
        <h1 className="is-size-1">Sonarr</h1>
        {!instanceInfo.isLoading && instanceInfo.data && (
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
        {instanceInfo.isLoading && <Spinner size={Sizes.LARGE} />}
      </RowLayout>
      <br />
      {currentSonarrConfig.isLoading ||
        (instanceInfo.isLoading && <Spinner size={Sizes.LARGE} />)}
      {!currentSonarrConfig.isLoading && !instanceInfo.isLoading && (
        <div>
          <div className="field">
            <label>API Key</label>
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
            <label>Hostname or IP Address</label>
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
            <label>
              Port{" "}
              <input
                type="checkbox"
                checked={usePort}
                onChange={() => setUsePort(!usePort)}
              />
            </label>
            <div className="control">
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
              <SecondaryButton
                type="button"
                onClick={() => getInstanceInfo(getValues(), true)}
              >
                Get instance info
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}
      <SecondaryDivider />
      {instanceInfo.isLoading && <Spinner size={Sizes.LARGE} />}
      {!instanceInfo.isLoading && instanceInfo.data && (
        <div>
          <div>
            <RowLayout borderBottom="1px solid LightGrey">
              <h3 className="is-size-4">Requests configurations</h3>
            </RowLayout>
            <br />
          </div>
          <div className="field">
            <label>Version</label>
            <div className="control">
              <input
                name="version"
                className="input"
                type="text"
                ref={register}
                value={
                  instanceInfo.data
                    ? instanceInfo.data.version
                    : currentSonarrConfig.data
                    ? currentSonarrConfig.data.version
                    : ""
                }
                disabled={true}
              />
            </div>
          </div>
          <div className="field">
            <label>Default Root Folder</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="rootFolder" ref={register}>
                  {instanceInfo.data &&
                    instanceInfo.data.rootFolders.map((rf, index) => (
                      <option key={index} value={rf}>
                        {rf}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label>Default Root Folder (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="animeRootFolder" ref={register}>
                  {instanceInfo.data &&
                    instanceInfo.data.rootFolders.map((rf, index) => (
                      <option key={index} value={rf}>
                        {rf}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label>Default Quality Profile</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="qualityProfileId" ref={register}>
                  {instanceInfo.data &&
                    instanceInfo.data.qualityProfiles.map((p, index) => (
                      <option key={index} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label>Default Quality Profile (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="animeQualityProfileId" ref={register}>
                  {instanceInfo.data &&
                    instanceInfo.data.qualityProfiles.map((p, index) => (
                      <option key={index} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          {isVersionThree() && (
            <div className="field">
              <label>Default Language Profile</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select name="languageProfileId" ref={register}>
                    {instanceInfo.data &&
                      instanceInfo.data.languageProfiles.map((l, index) => (
                        <option key={index} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          {isVersionThree() && (
            <div className="field">
              <label>Default Language Profile (Anime)</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select name="animeLanguageProfileId" ref={register}>
                    {instanceInfo.data &&
                      instanceInfo.data.languageProfiles.map((l, index) => (
                        <option key={index} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          <div className="field">
            <div className="control">
              <SecondaryButton type="submit">Save changes</SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};