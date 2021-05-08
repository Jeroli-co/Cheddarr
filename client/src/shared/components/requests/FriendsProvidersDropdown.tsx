import React from "react";
import { IUser } from "../../models/IUser";
import { InputField } from "../inputs/InputField";
import { useFormContext } from "react-hook-form";

type FriendsProvidersDropdownProps = {
  users: IUser[];
};

export const FriendsProvidersDropdown = (
  props: FriendsProvidersDropdownProps
) => {
  const { register } = useFormContext();

  return (
    <InputField isInline>
      <label>Friend to request: </label>
      <select name="requestedUsername" ref={register}>
        {props.users.map((user, index) => (
          <option key={index} value={user.username}>
            {user.username}
          </option>
        ))}
      </select>
    </InputField>
  );
};
