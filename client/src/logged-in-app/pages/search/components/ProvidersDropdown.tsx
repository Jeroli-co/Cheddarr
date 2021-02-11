import React, { ChangeEvent } from "react";
import { IPublicUser } from "../../../models/IPublicUser";
import { Spinner } from "../../../../shared/components/Spinner";
import { Sizes } from "../../../../shared/enums/Sizes";

type ProvidersDropdownProps = {
  providers: IPublicUser[];
  handleChanges: (user: IPublicUser) => void;
};

const ProvidersDropdown = ({
  providers,
  handleChanges,
}: ProvidersDropdownProps) => {
  if (!providers) return <Spinner size={Sizes.MEDIUM} />;
  if (providers.length === 0) return <p>No provider found</p>;

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const userProvider = providers.find(
      (user) => user.username === e.target.value
    );
    if (userProvider !== undefined) {
      handleChanges(userProvider);
    }
    e.preventDefault();
  };

  return (
    <div className="select is-primary">
      <select onChange={handleSelectChange}>
        {providers.map((p, index) => (
          <option key={index} value={p.username}>
            {p.username}
          </option>
        ))}
      </select>
    </div>
  );
};

export { ProvidersDropdown };