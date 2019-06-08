import React from 'react';
import { Flex, Box } from 'rebass';
import Nav from './nav';

export default ({ children }) => (
  <Flex width={1} px={6} mt={3} flexWrap="wrap" flexDirection="column">
    <Box width={1}>
      <Nav />
    </Box>
    <Flex>
      {children}
    </Flex>
  </Flex>
)