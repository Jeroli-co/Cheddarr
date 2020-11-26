import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { IAsyncResponse } from "../../../api/models/IAsyncResponse";
import { IPublicUser } from "../../models/IPublicUser";

type AddFriendsInputProp = {
  sendFriendRequest: (
    username: string
  ) => Promise<IAsyncResponse<IPublicUser | null>>;
};

const AddFriendsInput = ({ sendFriendRequest }: AddFriendsInputProp) => {
  const [searchFriends, setSearchFriends] = useState("");
  const [
    response,
    setResponse,
  ] = useState<IAsyncResponse<IPublicUser | null> | null>(null);

  const _onAddFriend = async () => {
    if (searchFriends.replace(/\s/g, "").length > 0) {
      const res = await sendFriendRequest(searchFriends);
      if (res.error === null) {
        setSearchFriends("");
      }
      setResponse(res);
    }
  };

  const _onKeyPressed = async (e: React.KeyboardEvent<HTMLInputElement>) => {
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
              <input
                className="input"
                type="search"
                placeholder="Add friends"
                autoComplete="off"
                onKeyPress={_onKeyPressed}
                value={searchFriends}
                onChange={(e) => setSearchFriends(e.target.value)}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
            <div className="control">
              <button className="button is-success" onClick={_onAddFriend}>
                <span className="icon is-small">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
              </button>
            </div>
          </div>
        </div>
        {response && (
          <div className="level-item">
            {(response.error && (
              <p className="help is-danger">{response.error}</p>
            )) ||
              (response.message && (
                <p className="help is-success">{response.message}</p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { AddFriendsInput };
