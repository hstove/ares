import React, { useEffect } from 'react';
// import dynamic from 'next/dynamic';
import { Text, Flex, Box } from 'rebass';

// import loadGame from '../lib/game';

export default () => {
  useEffect(() => {
    const start = async () => {
      // const loadGame = dynamic(() => import)
      const loadGame = (await import('../lib/game')).default;
      console.log(loadGame);
      loadGame();
    };
    start();
  });
  return (
    <Flex>
      <Box width={1} textAlign="center">
        <Text fontFamily="mono" fontSize={6} textAlign="center">Ares</Text>
        <Text fontFamily="mono" fontSize={4} textAlign="center">A space game</Text>
        <div id="game" style={{ width: '500px', margin: '0px auto' }} />
      </Box>
    </Flex>
  );
}
