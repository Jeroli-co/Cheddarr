import React, { ChangeEvent } from "react";
import { MediaTypes } from "../../../enums/MediaTypes";
import { RequestSeriesOptions } from "../enums/RequestSeriesOptions";
import {
  IMovieRequestCreate,
  ISeriesRequestCreate,
  isMovieRequestCreate,
  isSeriesRequestCreate,
} from "../../requests/models/IRequestCreate";
import { useRequestMedia } from "../../../hooks/useRequestMedia";

type MediaRequestButtonProps = {
  mediasType: MediaTypes;
  requestCreate: IMovieRequestCreate | ISeriesRequestCreate;
  onSeriesScopeChanges?: (requestSeriesOptions: string) => void;
};

const MediaRequestButton = ({
  mediasType,
  requestCreate,
  onSeriesScopeChanges,
}: MediaRequestButtonProps) => {
  const { requestMovie, requestSeries } = useRequestMedia();

  const handleRequest = () => {
    if (isMovieRequestCreate(requestCreate)) {
      requestMovie(requestCreate);
    } else if (isSeriesRequestCreate(requestCreate)) {
      requestSeries(requestCreate);
    }
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onSeriesScopeChanges) {
      onSeriesScopeChanges(e.target.value);
    }
  };

  return (
    <div className="field has-addons">
      <div className="control">
        <button
          type="submit"
          className="button is-primary"
          onClick={() => handleRequest()}
        >
          Request
        </button>
      </div>
      {mediasType === MediaTypes.SERIES && (
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
