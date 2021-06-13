import { PrimaryButton } from "../Button";
import React, { MouseEvent, useState } from "react";
import { SeriesRequestOptionsContextProvider } from "../../contexts/SeriesRequestOptionsContext";
import { RequestMediaModal } from "./RequestMediaModal";
import { IMedia } from "../../models/IMedia";
import { useSession } from "../../contexts/SessionContext";
import { checkRole } from "../../../utils/roles";
import { Roles } from "../../enums/Roles";

type RequestButtonProps = {
  media: IMedia;
};

export const RequestButton = (props: RequestButtonProps) => {
  const {
    session: { user },
  } = useSession();
  const [isRequestMediaModalOpen, setIsRequestMediaModalOpen] = useState(false);

  const onRequestClick = (e: MouseEvent<HTMLButtonElement>) => {
    setIsRequestMediaModalOpen(true);
    e.stopPropagation();
  };

  if (!user || (user && !checkRole(user.roles, [Roles.REQUEST]))) {
    return <></>;
  }

  return (
    <>
      <PrimaryButton
        className="request-button"
        type="button"
        onClick={(e) => onRequestClick(e)}
      >
        Request
      </PrimaryButton>
      {isRequestMediaModalOpen && (
        <SeriesRequestOptionsContextProvider>
          <RequestMediaModal
            media={props.media}
            closeModal={() => setIsRequestMediaModalOpen(false)}
          />
        </SeriesRequestOptionsContextProvider>
      )}
    </>
  );
};
