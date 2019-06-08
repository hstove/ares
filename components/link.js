import React from 'react';
import styled from 'styled-components';

const Link = styled.a`
  color: black;
  display: inline;
  font-family: 'Space Mono', mono;
  font-weight: 700;
  text-decoration: underline;
  &:visited {
    color: black;
  }
`;

export default ({ children, ...rest }) => (
  <Link {...rest} target="_blank">
    {children}
  </Link>
);
