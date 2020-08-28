import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";

const Pagination = ({ onPrevious, nextStepLabel, isLast }) => {
  return (
    <div className="field is-grouped is-grouped-centered">
      <div className="control">
        {onPrevious && (
          <button
            type="button"
            className="button is-rounded is-info is-medium"
            onClick={onPrevious.action}
          >
            <span className="icon">
              <FontAwesomeIcon icon={faArrowLeft} />
            </span>
            <span>{onPrevious.label}</span>
          </button>
        )}
      </div>
      <div className="control">
        <button
          type="submit"
          className={
            "button is-rounded is-medium " + (isLast ? "is-success" : "is-info")
          }
        >
          <span>{nextStepLabel}</span>
          <span className="icon">
            {isLast ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faArrowRight} />
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export { Pagination };
