import React from "react";
import { useRequestService } from "../../../modules/requests/hooks/useRequestService";

const MediaRequestButton = ({ requested_username, media_type, media_id }) => {
  const { request } = useRequestService();
  const handleRequest = (event) => {
    request(requested_username, media_type, media_id);
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

export { MediaRequestButton };
