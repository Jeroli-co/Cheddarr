import styled from "styled-components";
import * as React from "react";

const H1Style = styled.p`
  font-size: 3rem;
`;

const H2Style = styled.p`
  font-size: 2.5rem;
`;

const H3Style = styled.p`
  font-size: 2rem;
`;

const H4Style = styled.p`
  font-size: 1.5rem;
`;

const H1 = (props: any) => {
  return <H1Style>{props.children}</H1Style>;
};

const H2 = (props: any) => {
  return <H2Style>{props.children}</H2Style>;
};

const H3 = (props: any) => {
  return <H3Style>{props.children}</H3Style>;
};

const H4 = (props: any) => {
  return <H4Style>{props.children}</H4Style>;
};

export { H1, H2, H3, H4 };
