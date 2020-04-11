import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

const Spinner = () => {
  return <FontAwesomeIcon icon={faSpinner} pulse size="2x"/>;
};

export {
  Spinner
}
