import React from 'react';

import { Flex, Box, Text } from 'rebass';

export default () => (
  <Flex flexWrap="wrap" flexDirection="column" width={1}>
    <Box width={1} pl={3}>
      <Text fontSize={4} fontFamily="mono">Ares</Text>
    </Box>
    <Flex mb={5} px={3} style={{ borderBottom: '1px solid black', height: '35px' }}>
      <Box width={1 / 4}>
        <Text fontSize={2} fontFamily="mono">A space game</Text>
      </Box>
      <Box flex={1}>
        <Text fontSize={2} fontFamily="mono" textAlign="right">wtf</Text>
      </Box>
    </Flex>
  </Flex>
);
