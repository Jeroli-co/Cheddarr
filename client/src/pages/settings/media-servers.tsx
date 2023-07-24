import { useState } from "react";
import { H1 } from "../../shared/components/Titles";
import { Row } from "../../shared/components/layout/Row";
import { usePlexConfig } from "../../shared/contexts/PlexConfigContext";
import { AddItemBox } from "../../shared/components/ItemBox";
import { FullWidthTag } from "../../shared/components/FullWidthTag";
import { PrimaryDivider } from "../../shared/components/Divider";
import { PlexSettingsBoxPreview } from "../../logged-in-app/pages/settings/media-servers/plex/PlexSettingsBoxPreview";
import { MediaServersInfo } from "../../logged-in-app/pages/settings/media-servers/MediaServersInfo";
import { PickMediaServerTypeModal } from "../../logged-in-app/pages/settings/media-servers/PickMediaServerTypeModal";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [isPickMediaServersTypeModalOpen, setIsPickMediaServersTypeModalOpen] =
    useState(false);
  const { configs: plexSettingsList } = usePlexConfig();

  return (
    <div>
      <FullWidthTag>More media servers will be supported soon</FullWidthTag>
      <br />
      <H1>Configure your media servers</H1>
      <br />
      <Row>
        <AddItemBox onClick={() => setIsPickMediaServersTypeModalOpen(true)} />
        {plexSettingsList.data &&
          plexSettingsList.data.map((plexSettings, index) => {
            return (
              <PlexSettingsBoxPreview key={index} plexSettings={plexSettings} />
            );
          })}
      </Row>
      {isPickMediaServersTypeModalOpen && (
        <PickMediaServerTypeModal
          closeModal={() => setIsPickMediaServersTypeModalOpen(false)}
        />
      )}
      <PrimaryDivider />
      {plexSettingsList.data && (
        <MediaServersInfo config={plexSettingsList.data} />
      )}
    </div>
  );
};
