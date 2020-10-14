import React from "react";
import { MEDIA_TYPES } from "../../../media/enums/MediaTypes";
import { RequestsReceivedContextProvider } from "../../contexts/RequestsReceivedContext";

const RequestsReceived = () => {
  return (
    <div>
      <h3 className="title is-3">Movies requests received</h3>
      <RequestsReceivedContextProvider media_type={MEDIA_TYPES.MOVIES} />
      <div className="is-divider" />
      <h3 className="title is-3">Series requests received</h3>
      <RequestsReceivedContextProvider media_type={MEDIA_TYPES.SERIES} />
    </div>
  );
};

export { RequestsReceived };
