import React, {
  useEffect, useState, useContext, Component,
} from 'react';
// import dynamic from 'next/dynamic';
import {
  Text, Flex, Box, Button,
} from 'rebass';
// import { User } from 'radiks';
import User from 'radiks/lib/models/user';
import loadGame from '../lib/game';
import version from '../lib/game/version';
import HighScore from '../models/high-score';
import context from '../lib/context';

// import loadGame from '../lib/game';

export default class Game extends Component {
  static async getInitialProps() {
    return {};
  }

  state = {
    isAuthed: false,
    myScore: null,
    highScores: [],
  }

  componentDidMount() {
    const { userSession } = this.context;
    const newState = {};
    if (userSession.isUserSignedIn()) {
      newState.isAuthed = true;
    } else {
      loadGame();
    }
    this.getScores();
    if (userSession.isSignInPending()) {
      this.handleAuth();
    }
    // loadGame(handleNewScore);
    this.setNewState(newState);
  }

  setNewState(newState) {
    this.setState(state => ({
      ...state,
      ...newState,
    }));
  }

  async getScores() {
    const { userSession } = this.context;
    let { myScore } = this.state;
    const highScores = await HighScore.fetchList({
      sort: '-score',
      version,
      limit: 10,
    }, { decrypt: false });
    console.log(userSession.isUserSignedIn());
    if (userSession.isUserSignedIn()) {
      const _myScore = await HighScore.findOne({
        username: userSession.loadUserData().username,
      });
      console.log(_myScore);
      myScore = _myScore;
      // setMyScore(_myScore);
      // this.setState({
      //   myScore: _myScore,
      // });
      loadGame({
        handleNewScore: newScore => this.handleNewScore(newScore),
        highScore: myScore ? myScore.attrs.score : null,
      });
    }
    console.log(highScores);
    this.setState(newState => ({
      ...newState,
      myScore,
      highScores,
    }));
  }

  async handleNewScore(newScore) {
    let { myScore } = this.state;
    const { userSession } = this.context;
    console.log('got a new score', newScore);
    console.log(myScore);
    if (myScore) {
      if (myScore.attrs.score < newScore) {
        myScore.update({
          score: newScore,
        });
        await myScore.save();
      }
      console.log('existing score');
    } else if (userSession.isUserSignedIn()) {
      const { username } = userSession.loadUserData();
      const _score = new HighScore({
        username,
        score: newScore,
        version,
      });
      await _score.save();
      myScore = _score;
    }
    this.updateLeaderBoards(myScore);
  }

  async updateLeaderBoards(myScore) {
    const { highScores } = this.state;
    let newScores = highScores.slice();
    let madeBetterScore = false;
    highScores.forEach((score, i) => {
      if (score.attrs.score < myScore.attrs.score) {
        madeBetterScore = true;
        newScores.splice(i, 0, myScore);
      }
    });
    if (!madeBetterScore && newScores.length < 10) {
      newScores.push(myScore);
    }
    const existingUsernames = {};
    newScores = newScores.filter((score) => {
      if (existingUsernames[score.attrs.username]) {
        return false;
      }
      existingUsernames[score.attrs.username] = true;
      return true;
    });
    console.log(newScores.map(s => s.attrs.score));
    this.setState({
      myScore,
      highScores: newScores.slice(0, 10),
    });
  }

  async handleAuth() {
    const { userSession } = this.context;
    await userSession.handlePendingSignIn();
    await User.createWithCurrentUser();
    document.location = '/';
  }

  login() {
    const { userSession } = this.context;
    userSession.redirectToSignIn();
  }

  scores() {
    const { highScores } = this.state;
    // const fakeScores = [];
    // for (let index = 0; index < 10; index += 1) {
    //   // const element = array[index];
    //   if (highScores[0]) {
    //     fakeScores.push(highScores[0]);
    //   }
    //   console.log(highScores[0]);
    // }
    return highScores.map(score => (
      <Box width={1} key={score._id} mt={1}>
        <Text fontFamily="mono" fontSize={1}>{score.attrs.username}</Text>
        <Text fontFamily="mono" fontSize={2}>{score.attrs.score.toFixed()}</Text>
      </Box>
    ));
  }

  render() {
    const { isAuthed } = this.state;
    console.log(this.state);
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
              {!isAuthed && (
                <>
                  <Text fontFamily="mono" fontSize={3}>
                    Hello, pilot. Login to use the leaderboard.
                  </Text>
                  <Button fontFamily="mono" my={2} bg="black" onClick={() => this.login()}>
                    Login
                  </Button>
                </>
              )}
              <Flex flexWrap="wrap" flexDirection="column">
                <Box width={1}>
                  <Text fontFamily="mono" fontSize={4}>Leaderboard</Text>
                </Box>
                {this.scores()}
              </Flex>
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
  }
}

Game.contextType = context;
