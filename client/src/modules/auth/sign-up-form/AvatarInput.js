import React, { useState } from "react";
import { Pagination } from "./Pagination";

import cheeseBlue from "../../../assets/profile/cheese-blue.png";
import cheeseCyan from "../../../assets/profile/cheese-cyan.png";
import cheeseGreen from "../../../assets/profile/cheese-green.png";
import cheeseOcean from "../../../assets/profile/cheese-ocean.png";
import cheeseOrange from "../../../assets/profile/cheese-orange.png";
import cheesePink from "../../../assets/profile/cheese-pink.png";
import cheesePurple from "../../../assets/profile/cheese-purple.png";
import cheeseRed from "../../../assets/profile/cheese-red.png";
import { Image } from "../../../elements/Image";
import { RowLayout } from "../../../elements/layouts";

const avatars = [
  { title: "cheese-cyan.png", src: cheeseCyan, description: "Cyan cheese" },
  {
    title: "cheese-ocean.png",
    src: cheeseOcean,
    description: "Ocean cheese",
  },
  { title: "cheese-blue.png", src: cheeseBlue, description: "Blue cheese" },
  {
    title: "cheese-green.png",
    src: cheeseGreen,
    description: "Green cheese",
  },
  {
    title: "cheese-orange.png",
    src: cheeseOrange,
    description: "Orange cheese",
  },
  { title: "cheese-red.png", src: cheeseRed, description: "Red cheese" },
  {
    title: "cheese-purple.png",
    src: cheesePurple,
    description: "Purple cheese",
  },
  { title: "cheese-pink.png", src: cheesePink, description: "Pink cheese" },
];

const AvatarInput = ({ onPrevious, onValidInput }) => {
  const [selectedImage, setSelectedImage] = useState(avatars[0].title);

  const isSelected = (title) => {
    return title === selectedImage;
  };

  return (
    <form onSubmit={() => onValidInput(selectedImage)}>
      <RowLayout childMargin="10px" wrap="wrap">
        {avatars.map((avatar) => (
          <Image
            key={avatar.title}
            src={avatar.src}
            alt={avatar.description}
            width="100px"
            height="100px"
            opacity={isSelected(avatar.title) ? "1" : "0.5"}
            hoverOpacity="1"
            cursor="pointer"
            border={isSelected(avatar.title) ? "5px solid #00cc00 " : "none"}
            borderRadius={isSelected(avatar.title) ? "100px " : "0"}
            onClick={() => setSelectedImage(avatar.title)}
          />
        ))}
      </RowLayout>
      <br />
      <Pagination
        onPrevious={{ label: "Password", action: onPrevious }}
        nextStepLabel="Sign Up"
        isLast={true}
      />
    </form>
  );
};

export { AvatarInput };
