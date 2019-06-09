import React from 'react';
import styled from 'styled-components';
import { Flex, Box, Text } from 'rebass';
import Link from '../components/link';

const Header = styled(Box)`
  border-bottom: 1px solid black;
`;

const FAQ = ({ title, children }) => (
  <>
    <Header width={1} mt={4}>
      <Text fontSize={5} fontFamily="mono" fontWeight={700}>
        {title}
      </Text>
    </Header>    
    <Box width={1} pt={4}>
      <Text fontSize={3} fontFamily="mono" lineHeight={2}>
        {children}
      </Text>
    </Box>
  </>
)

export default () => (
  <>
    <Flex flexWrap="wrap" flexDirection="column" mb={5}>
      <Box width={1} px={[2, 7]} mb={3}>
        <Text fontSize={7} fontFamily="mono" textAlign="center" fontWeight={700}>
          Fly your rocket as far as you can.
        </Text>
      </Box>
      <FAQ title="the basics">
        The goal is to fly your rocket as far to the right as you can.
        <br />
        <br />
        Use the
        <strong> space bar </strong>
        to fire the rocket's thrusters.
        <br />
        <br />
        Use the
        <strong> left and right arrows </strong>
        to rotate the rocket.
        <br />
        <br />
        Avoid the
        <strong> red mines </strong>
        - touch them and you die.
        <br />
        <br />
        Your rocket has a limited amount of fuel. To get more fuel, do
        <strong> flips </strong>
        and pickup the
        <strong> blue fuel pods</strong>
        .
      </FAQ>
      <FAQ title="the background">
        Ares is inspired by
        <em> The Martian</em>
        , a sci-fi novel that became a movie, where Matt Damon plays a snarky austronaut.
        <br />
        <br />
        The game is kind of a mix between
        <strong> Flappy Bird </strong>
        and
        <strong> Lunar Lander</strong>
        .
        <br />
        <br />
        It was built with
        {' '}
        <Link href="https://molleindustria.github.io/p5.play/">p5.play</Link>
        , and was made by
        {' '}
        <Link href="https://twitter.com/heynky">Hank Stoever</Link>
        .
        <br />
        <br />
        The source code is available on
        {' '}
        <Link href="https://github.com/hstove/ares">Github</Link>
        .
      </FAQ>
    </Flex>
  </>
);
