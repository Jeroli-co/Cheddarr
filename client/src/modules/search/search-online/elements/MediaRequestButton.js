import React from "react";
import { useRequestService } from "../../../requests/hooks/useRequestService";
import { MEDIA_TYPES } from "../../../media/enums/MediaTypes";
import { REQUEST_SERIES_OPTIONS } from "../../../requests/enums/RequestSeriesOptions";

const MediaRequestButton = ({
  requested_username,
  media_type,
  request_body,
  onSeriesScopeChanges,
}) => {
  const { request } = useRequestService();

  const handleRequest = (event) => {
    request(requested_username, media_type, request_body);
    event.preventDefault();
  };

  return (
    <div className="field has-addons">
      <div className="control">
        <button
          type="submit"
          className="button is-primary"
          onClick={handleRequest}
        >
          Request
        </button>
      </div>
      {media_type === MEDIA_TYPES.SERIES && (
        <div className="control is-expanded">
          <div className="select is-fullwidth">
            <select
              name="request_series_scope"
              onChange={(e) => onSeriesScopeChanges(e)}
            >
              <option value={REQUEST_SERIES_OPTIONS.ALL}>
                {REQUEST_SERIES_OPTIONS.ALL}
              </option>
              <option value={REQUEST_SERIES_OPTIONS.SELECT}>
                {REQUEST_SERIES_OPTIONS.SELECT}
              </option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export { MediaRequestButton };
