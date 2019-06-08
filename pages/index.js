import React, {
  useEffect, useState, useContext, useHook,
} from 'react';
// import dynamic from 'next/dynamic';
import { Text, Flex, Box } from 'rebass';
import loadGame from '../lib/game';
import context from '../lib/context';

// import loadGame from '../lib/game';

export default () => {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const { userSession } = useContext(context);
  // console.log(userSession.());
  // console.log(process.env.RADIKS_API_SERVER);

  const handleNewScore = (newScore) => {
    console.log('got a new score', newScore);
  };

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setIsAuthed(true);
    }
    setLoading(false);
    console.log(userSession.isUserSignedIn());
    loadGame(handleNewScore);
    // loadGame(handleNewScore);
  }, []);

  useEffect(() => {
    // if (isAuthed) {
    //   loadGame(handleNewScore);
    // }
  }, [isAuthed]);

  return (
    <Flex>
      <Box width={1} textAlign="center" px={4}>
        <Text fontFamily="mono" fontSize={6} textAlign="center">Ares</Text>
        <Text fontFamily="mono" fontSize={4} mt={-3} mb={2} textAlign="center">A space game</Text>
        <Flex>
          <Box width="800px">
            <div id="game" style={{ width: '100%', margin: '0px auto' }} />
          </Box>
          <Box flex={1} pl={4}>
            <Text fontFamily="mono" fontSize={4}>Leaderboard</Text>
          </Box>
        </Flex>
        {/* {loading ? (
          <Text mt={4} fontSize={4} textAlign="center" fontFamily="mono">Loading...</Text>
        ) : (
          <div id="game" style={{ width: '800px', margin: '0px auto' }} />
        )} */}
      </Box>
    </Flex>
  );
};
