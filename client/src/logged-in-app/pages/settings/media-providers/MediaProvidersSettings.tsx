import { useState } from "react";
import { H1 } from "../../../../shared/components/Titles";
import { Row } from "../../../../shared/components/layout/Row";
import { PickMediaProviderTypeModal } from "./PickMediaProviderTypeModal";
import { RadarrSettingsBoxPreview } from "./radarr/RadarrSettingsBoxPreview";
import { SonarrSettingsBoxPreview } from "./sonarr/SonarrSettingsBoxPreview";
import {
  AddItemBox,
  SpinnerItemBox,
} from "../../../../shared/components/ItemBox";
import { useSonarrConfigsContext } from "../../../../shared/contexts/SonarrConfigContext";
import { useRadarrConfigsContext } from "../../../../shared/contexts/RadarrConfigsContext";

export const MediaProvidersSettings = () => {
  const [
    isPickMediaProvidersTypeModalOpen,
    setIsPickMediaProvidersTypeModalOpen,
  ] = useState(false);

  const { radarrConfigs } = useRadarrConfigsContext();
  const { sonarrConfigs } = useSonarrConfigsContext();

  return (
    <div>
      <H1>Configure your media providers</H1>
      <br />
      <Row>
        <AddItemBox
          onClick={() => setIsPickMediaProvidersTypeModalOpen(true)}
        />
        {radarrConfigs.isLoading && <SpinnerItemBox />}
        {!radarrConfigs.isLoading &&
          radarrConfigs.data &&
          radarrConfigs.data.map((config, index) => {
            return (
              <RadarrSettingsBoxPreview key={index} radarrConfig={config} />
            );
          })}
        {sonarrConfigs.isLoading && <SpinnerItemBox />}
        {!sonarrConfigs.isLoading &&
          sonarrConfigs.data &&
          sonarrConfigs.data.map((config, index) => {
            return (
              <SonarrSettingsBoxPreview key={index} sonarrConfig={config} />
            );
          })}
      </Row>
      {isPickMediaProvidersTypeModalOpen && (
        <PickMediaProviderTypeModal
          closeModal={() => setIsPickMediaProvidersTypeModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MediaProvidersSettings;
