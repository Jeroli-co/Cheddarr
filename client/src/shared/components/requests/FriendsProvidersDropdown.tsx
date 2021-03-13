import React from "react";
import { IPublicUser } from "../../models/IPublicUser";
import { InputField } from "../inputs/InputField";
import { useFormContext } from "react-hook-form";

type FriendsProvidersDropdownProps = {
  users: IPublicUser[];
};

export const FriendsProvidersDropdown = (
  props: FriendsProvidersDropdownProps
) => {
  const { register } = useFormContext();

  return (
    <InputField isInline>
      <label>Provider : </label>
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
