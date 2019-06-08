import scene from './scene';

export default (handleNewScore) => {
  const game = new window.p5(scene(handleNewScore), 'game');
  return game;
};
