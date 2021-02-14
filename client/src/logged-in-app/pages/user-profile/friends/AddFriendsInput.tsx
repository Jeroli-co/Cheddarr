import React, { useState } from "react";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "../../../../shared/components/Button";
import { InputField } from "../../../../shared/components/inputs/InputField";
import styled from "styled-components";
import { Icon } from "../../../../shared/components/Icon";

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  button {
    margin-left: 20px;
  }
`;

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
    <Container>
      <InputField withIcon>
        <div className="with-left-icon">
          <input
            type="search"
            placeholder="Add friends"
            autoComplete="off"
            onKeyPress={_onKeyPressed}
            value={searchFriends}
            onChange={(e) => setSearchFriends(e.target.value)}
          />
          <span className="icon">
            <Icon icon={faSearch} />
          </span>
        </div>
      </InputField>
      <IconButton onClick={_onAddFriend}>
        <Icon icon={faPlus} />
      </IconButton>
    </Container>
  );
};

export { AddFriendsInput };
