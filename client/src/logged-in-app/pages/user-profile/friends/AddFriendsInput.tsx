import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { PrimaryButton } from "../../../../shared/components/Button";
import { InputField } from "../../../../shared/components/inputs/InputField";

type AddFriendsInputProp = {
  sendFriendRequest: (username: string) => void;
};

const AddFriendsInput = ({ sendFriendRequest }: AddFriendsInputProp) => {
  const [searchFriends, setSearchFriends] = useState("");

  const _onAddFriend = async () => {
    if (searchFriends.replace(/\s/g, "").length > 0) {
      sendFriendRequest(searchFriends);
      setSearchFriends("");
    }
  };

  const _onKeyPressed = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await _onAddFriend();
    }
  };

  return (
    <div className="level-item">
      <InputField withIcon>
        <div className="with-left-icon">
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
      </InputField>

      <PrimaryButton onClick={_onAddFriend}>
        <span>
          <FontAwesomeIcon icon={faPlus} />
        </span>
      </PrimaryButton>
    </div>
  );
};

export { AddFriendsInput };
