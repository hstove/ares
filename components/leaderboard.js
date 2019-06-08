import React from 'react';
import styled from 'styled-components';
import { Flex, Box, Text } from 'rebass';
import accounting from 'accounting';

const scoresList = (scores) => {
  return scores.slice(0, 10).map(score => (
    <Flex width={1} key={score._id} mt={3}>
      <Box>
        <Text fontFamily="mono" fontSize={1} display="inline-block">{score.attrs.username}</Text>
      </Box>
      <Box flex={1}>
        <Text fontFamily="mono" fontSize={1} fontWeight="700" textAlign="right" display="inline-block">
          {accounting.formatNumber(score.attrs.score, 0)}
        </Text>
      </Box>
    </Flex>
  ));
};

const Header = styled(Box)`
  border-bottom: 1px solid black;
  padding-bottom: 5px;
`

export default ({ scores }) => (
  <Flex flexWrap="wrap" flexDirection="column">
    <Header width={1} mb={3}>
      <Text fontFamily="mono" fontSize={4}>Leaderboard</Text>
    </Header>
    {scoresList(scores)}
  </Flex>
);
