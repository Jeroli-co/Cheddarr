import React, { createContext } from "react";
import { useMedia } from "../../media/hooks/useMedia";
import { Spinner } from "../../../utils/elements/Spinner";

const RequestReceivedContext = createContext();

const RequestReceivedContextProvider = (props) => {
  const media = useMedia(
    props.media_type,
    props.request.tmdb_id || props.request.tvdb_id
  );

  if (!media.isLoaded) {
    return <Spinner size="2x" />;
  }

  if (media.isLoaded && media.data === null) {
    return <p>An error occurred</p>;
  }

  return (
    <RequestReceivedContext.Provider
      value={{
        media: media.data,
        request: props.request,
      }}
    >
      {props.children}
    </RequestReceivedContext.Provider>
  );
};

export { RequestReceivedContext, RequestReceivedContextProvider };
