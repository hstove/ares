import scene from './scene';

export default () => {
  const game = new window.p5(scene, 'game');
  return game;
};
