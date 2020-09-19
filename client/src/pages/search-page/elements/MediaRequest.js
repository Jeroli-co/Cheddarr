import React from "react";
import { useFriends } from "../../../hooks/useFriends";

const MediaRequest = ({ userProvider, media }) => {
  const { requestMedia } = useFriends();
  const handleRequest = (event) => {
    requestMedia(userProvider, media);
    event.preventDefault();
  };

  return (
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
