import React, {useContext, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSearch} from "@fortawesome/free-solid-svg-icons";
import {FriendsContext} from "../../../../contexts/FriendsContext";

const AddFriendsInput = () => {

  const { addFriend } = useContext(FriendsContext);
  const [searchFriends, setSearchFriends] = useState("");
  const [httpResponse, setHttpResponse] = useState(null);

  const _onAddFriend = async () => {
    if (searchFriends.replace(/\s/g,'').length > 0) {
      const res = await addFriend(searchFriends);
      if (res) {
        switch (res.status) {
          case 201:
            setSearchFriends("");
            setHttpResponse(res);
            break;
          default:
            setHttpResponse(res);
        }
      }
    }
  };

  const _onKeyPressed = async (e) => {
    if (e.key === "Enter") {
      await _onAddFriend();
    }
  };

  return (
    <div className="level">
      <div className="level-left">
        <div className="level-item">
          <div className="field has-addons">
            <div className="control has-icons-left">
              <input className="input"
                     type="search"
                     placeholder="Add friends"
                     autoComplete="off"
                     onKeyPress={_onKeyPressed}
                     value={searchFriends}
                     onChange={(e) => setSearchFriends(e.target.value)}
              />
              <span className="icon is-small is-left"><FontAwesomeIcon icon={faSearch} /></span>
            </div>
            <div className="control">
              <button className="button is-success" onClick={_onAddFriend}>
                <span className="icon is-small"><FontAwesomeIcon icon={faPlus} /></span>
              </button>
            </div>
          </div>
        </div>
        { httpResponse &&
          <div className="level-item">
            {
              (httpResponse.status === 200 && <p className="help is-success">{httpResponse.message}</p>) ||
              (<p className="help is-danger">{httpResponse.message}</p>)
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