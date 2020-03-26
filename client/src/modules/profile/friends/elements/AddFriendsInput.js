import React, {useContext, useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSearch} from "@fortawesome/free-solid-svg-icons";
import {FriendsContext} from "../../../../contexts/FriendsContext";

const AddFriendsInput = () => {

  const { addFriend, addFriendsFeedback } = useContext(FriendsContext);
  const searchFriendsInput = useRef();

  const _onAddFriend = () => {
    const inputValue = searchFriendsInput.current.value;
    if (inputValue.replace(/\s/g,'').length > 0)
      addFriend(inputValue);
  };

  return (
    <div className="level">
      <div className="level-left">
        <div className="level-item">
          <div className="field has-addons">
            <div className="control has-icons-left">
              <input className="input" type="search" ref={searchFriendsInput} placeholder="Add friends" autoComplete="off" />
              <span className="icon is-small is-left"><FontAwesomeIcon icon={faSearch} /></span>
            </div>
            <div className="control">
              <button className="button is-success" onClick={_onAddFriend}>
                <span className="icon is-small"><FontAwesomeIcon icon={faPlus} /></span>
              </button>
            </div>
          </div>
        </div>
        { addFriendsFeedback &&
          <div className="level-item">
            {
              (addFriendsFeedback.status === 200 && <p className="help is-success">{addFriendsFeedback.message}</p>) ||
              (<p className="help is-danger">{addFriendsFeedback.message}</p>)
            }
          </div>
        }
      </div>
    </div>
  );
};

export {
  AddFriendsInput
}