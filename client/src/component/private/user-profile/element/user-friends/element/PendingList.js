import React, {useContext, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus} from "@fortawesome/free-solid-svg-icons";
import {FriendsContext} from "../../../../../../context/FriendsContext";

const PendingList = () => {

  const { pendings, cancelRequest } = useContext(FriendsContext);

  useEffect(() => {
    console.log(pendings);
  });

  return (
      pendings.map((pending) => {
      return (
        <div key={pending.username}>
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <figure className="image is-64x64">
                  <img src={pending["user_picture"]} alt="User" />
                </figure>
              </div>
              <div className="level-item">
                <p className="is-size-5"><i>{'@' + pending.username}</i></p>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button className="button is-danger is-small" type="button" onClick={() => cancelRequest(pending.username)}>
                  <span className="icon">
                    <FontAwesomeIcon icon={faMinus}/>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    })
  )
};

export {
  PendingList
}