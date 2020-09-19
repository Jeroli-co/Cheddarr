import React from "react";
import { Spinner } from "../../../elements/Spinner";
import { useMediaStatus } from "../../../hooks/useMediaStatus";
import { useFriends } from "../../../hooks/useFriends";

const MediaRequest = ({ userProvider, media }) => {
  const { requestMedia } = useFriends();
  const isMediaAvailable = useMediaStatus(userProvider, media);

  const handleRequest = (event) => {
    requestMedia(userProvider, media);
    event.preventDefault();
  };

  if (isMediaAvailable === null) return <Spinner size="small" />;

  return isMediaAvailable ? (
    <p>Already added</p>
  ) : (
    <button
      type="button"
      className="button is-info is-medium"
      onClick={handleRequest}
    >
      Request
    </button>
  );
};

export { MediaRequest };
