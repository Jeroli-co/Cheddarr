import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { RowLayout } from "../layouts";
import styled from "styled-components";

const ElementStyle = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;

  .line-bullet-list-icon {
    margin-left: 10px;
    margin-right: 10px;
  }
`;

const LineBulletList = ({ children }) => {
  return (
    <RowLayout>
      {children.map((child, index) => (
        <ElementStyle key={index}>
          {child}
          {index < children.length - 1 && (
            <FontAwesomeIcon
              className="line-bullet-list-icon"
              icon={faCircle}
              style={{ fontSize: "5px" }}
            />
          )}
        </ElementStyle>
      ))}
    </RowLayout>
  );
};

export { LineBulletList };
