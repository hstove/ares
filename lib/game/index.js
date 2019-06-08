import scene from './scene';

export default (opts = {}) => {
  const game = new window.p5(scene(opts), 'game');
  return game;
};
