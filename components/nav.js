import React from 'react';
import styled from 'styled-components';
import { Flex, Box, Text } from 'rebass';

const NavLink = styled.a`
  color: black;
  text-decoration: none;
  &:visited {
    color: black;
  }
  &:hover {
    text-decoration: underline;
  }
`;

export default () => (
  <Flex flexWrap="wrap" flexDirection="column" width={1}>
    <Box width={1} pl={3}>
      <Text fontSize={4} fontFamily="mono">
        <NavLink href="/">Ares</NavLink>
      </Text>
    </Box>
    <Flex mb={5} px={3} style={{ borderBottom: '1px solid black', height: '35px' }}>
      <Box width={1 / 4}>
        <Text fontSize={2} fontFamily="mono">A space game</Text>
      </Box>
      <Box flex={1}>
        <Text fontSize={2} fontFamily="mono" textAlign="right">
          <NavLink href="/wtf">wtf</NavLink>
        </Text>
      </Box>
    </Flex>
  </Flex>
);
