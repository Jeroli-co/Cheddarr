import React, { ChangeEvent, MouseEvent, useContext } from "react";
import { MediasTypes } from "../../../enums/MediasTypes";
import { RequestSeriesOptions } from "../../../enums/RequestSeriesOptions";
import { RequestService } from "../../../services/RequestService";
import {
  IMovieRequestCreate,
  ISeriesRequestCreate,
} from "../../../models/IRequestCreate";
import { NotificationContext } from "../../../contexts/notifications/NotificationContext";

type MediaRequestButtonProps = {
  mediasType: MediasTypes;
  requestCreate: IMovieRequestCreate | ISeriesRequestCreate;
  onSeriesScopeChanges?: (requestSeriesOptions: string) => void;
};

const MediaRequestButton = ({
  mediasType,
  requestCreate,
  onSeriesScopeChanges,
}: MediaRequestButtonProps) => {
  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  const handleRequest = (e: MouseEvent) => {
    RequestService.RequestMedias(mediasType, requestCreate).then(
      (res) => {
        pushSuccess("Request sent.");
      },
      (error) => {
        pushDanger("Error sending request, please try again later.");
      }
    );
    e.preventDefault();
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onSeriesScopeChanges) {
      onSeriesScopeChanges(e.target.value);
    }
    e.preventDefault();
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
      {mediasType === MediasTypes.SERIES && (
        <div className="control is-expanded">
          <div className="select is-fullwidth">
            <select name="request_series_scope" onChange={onSelectChange}>
              <option value={RequestSeriesOptions.ALL}>
                {RequestSeriesOptions.ALL}
              </option>
              <option value={RequestSeriesOptions.SELECT}>
                {RequestSeriesOptions.SELECT}
              </option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export { MediaRequestButton };
