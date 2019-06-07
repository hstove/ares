// import Modernizr from 'modernizr';
// import p5 from '@code-dot-org/p5.play';
// import p5 from 'p5';
import scene from './scene';

export default () => {
  const game = new window.p5(scene, 'game');
  return game;
};

// const player = undefined;
// const ground = undefined;
// const ceiling = undefined;
// const boostSprite = undefined;
// const pickups = undefined;
// const mines = undefined;
// const playerWidth = 50;
// const playerHeight = 5;
// const maxSpeed = 5;
// const speed = 0.006;
// const slowSpeed = 0.003;
// const gravity = 0.04;
// const framesUntilMine = 100;
// const framesUntilPickup = 150;
// const mineWidth = 20;
// const pickupWidth = 40;
// const pickupColor = '#2980b9';
// const mineColor = '#e74c3c';
// const score = 0;
// let highScore = 0;
// const KEY = {};

// if (Modernizr.localstorage && localStorage[`highScore${speed}`]) {
//   highScore = parseInt(localStorage[`highScore${speed}`], 10);
// }

// const gameOver = true;
// const maxBoost = 200;
// const boost = maxBoost;
// const flipBoostMultiplier = 0.25;
// const pickupBoostMultiplier = 0.1;
// const lastRotation = undefined;
// const startRotation = undefined;
// const frontFlip = undefined;
// const backFlip = undefined;
// const gameHeight = 600;
// const gameWidth = 800;
// const phoneIsInverted = false;
// const lastPhoneRotation = -45;
// let explosion = null;
// let beepbeep = null;

// document.ontouchstart = function onTouchStart(e) {
//   e.preventDefault();
//   return false;
// };

// document.ontouchmove = function onTouchMove(e) {
//   e.preventDefault();
//   return false;
// };

// window.preload = function preload() {
//   explosion = loadSound('sounds/explosion.wav');
//   beepbeep = loadSound('sounds/beepbeep.wav');
// };

// window.setup = function setup() {
//   explosion.setVolume(0.1);
//   beepbeep.setVolume(0.1);
//   KEY.SPACE_BAR = 32;
//   createCanvas(gameWidth, gameHeight);
//   pickups = new Group();
//   mines = new Group();
//   player = createSprite(exitXOffset, opening, playerWidth, playerHeight);
//   player.draw = function () {
//     fill('#c0392b');
//     rect(0, 0, playerWidth, playerHeight);
//     fill('#2c3e50');
//     rect(0, 0, min(playerWidth * boost / maxBoost, playerWidth), playerHeight);
//   };
//   resetPlayer();
//   ground = createSprite(0, opening + groundHeight / 2, groundWidth, groundHeight);
//   ground.draw = function draw() {
//     fill('#8e44ad');
//     rect(0, 0, groundWidth, groundHeight);
//   };
//   ceiling = createSprite(0, 0, groundWidth, 20);
//   ceiling.draw = function draw() {
//     rect(0, 0, groundWidth, 20);
//   };
//   boostSprite = createSprite(0, 0, 10, 10);
//   boostSprite.visible = false;
//   boostSprite.draw = function () {
//     fill('#e74c3c');
//     rect(0, 0, 10, 10);
//   };
// };

// window.draw = function draw() {
//   let adjustment; let i; let
//     lines;
//   background('#95a5a6');
//   fill('#2c3e50');
//   if (gameOver && keyWentDown(KEY.SPACE_BAR)) {
//     newGame();
//   }
//   if (gameOver) {
//     fill('#2c3e50');
//     textAlign(CENTER);
//     lines = ['You are stuck on Mars at Ares 3.', 'You need to get to Ares 4, which is far away to your right.', 'Go as far as you can without running out of feul', 'Pick up the blue things for feul', 'Do flips for more feul', 'Don\'t hit red things', 'Press Space Bar to Play'];
//     i = 0;
//     while (i < lines.length) {
//       text(lines[i], player.position.x + width * 0.25, height / 2 + 14 * i);
//       i++;
//     }
//   } else {
//     player.debug = false;
//     if (player.collide(ceiling) || player.overlap(mines) || player.collide(ground)) {
//       die();
//     }
//     if (deviceRotation) {
//       adjustment = startRotation - deviceRotation;
//       player.rotation += adjustment / 10;
//     }
//     if (keyDown(KEY.UP_ARROW) || keyDown(KEY.LEFT_ARROW)) {
//       player.rotation += -5;
//     } else if (keyDown(KEY.DOWN_ARROW) || keyDown(KEY.RIGHT_ARROW)) {
//       player.rotation += 4;
//     }
//     player.overlap(pickups, (player, pickup) => {
//       beepbeep.play();
//       pickup.remove();
//       return boost = min(boost + maxBoost * pickupBoostMultiplier, maxBoost);
//     });
//     if (frameCount % framesUntilPickup === 0) {
//       pickups.add(newObstacle('pickup'));
//     }
//     if (frameCount % framesUntilMine === 0) {
//       mines.add(newObstacle('mine'));
//     }
//     handleBoost();
//     player.velocity.y += gravity;
//     player.velocity.x *= 0.999;
//     score = player.position.x - exitXOffset;
//     handleFlips();
//   }
//   drawScore();
//   drawMarkers();
//   drawSprites();
//   clearOldSprites();
//   return camera.position.x = player.position.x + width / 4;
// };

// const newGame = function newGame() {
//   startRotation = deviceRotation;
//   highScore = Math.max(score, highScore);
//   if (Modernizr.localstorage) {
//     localStorage[`highScore${speed}`] = highScore;
//   }
//   score = 0;
//   boost = maxBoost;
//   resetPlayer();
//   gameOver = false;
//   lastRotation = 0;
//   mines.removeSprites(true);
//   return pickups.removeSprites(true);
// };

// const resetPlayer = function resetPlayer() {
//   player.rotation = -90;
//   player.position.x = exitXOffset;
//   return player.position.y = opening - (playerWidth / 2) - 1;
// };

// const clearOldSprites = function clearOldSprites() {
//   let group; let i; let j; let len; let object; let ref; let
//     results;
//   if (frameCount % 50 !== 0) {
//     return false;
//   }
//   ref = [mines, pickups];
//   results = [];
//   for (j = 0, len = ref.length; j < len; j++) {
//     group = ref[j];
//     results.push((function () {
//       let k; let len1; let
//         results1;
//       results1 = [];
//       for (i = k = 0, len1 = group.length; k < len1; i = ++k) {
//         object = group[i];
//         if (object && object.position.x < (player.position.x - width)) {
//           object.remove();
//           results1.push(group.remove(object));
//         } else {
//           results1.push(undefined);
//         }
//       }
//       return results1;
//     })());
//   }
//   return results;
// };

// const die = function die() {
//   explosion.play();
//   player.debug = true;
//   gameOver = true;
//   player.velocity.y = 0;
//   return player.velocity.x = 0;
// };

// const drawScore = function drawScore() {
//   let i; let j; let left; let len; let line; let lines; let
//     results;
//   textAlign(LEFT);
//   left = player.position.x - width * 0.25 + 5;
//   fill('black');
//   lines = [`Score: ${score.toFixed()}`, `Boost: ${boost.toFixed()}`, `High Score: ${highScore.toFixed()}`];
//   results = [];
//   for (i = j = 0, len = lines.length; j < len; i = ++j) {
//     line = lines[i];
//     results.push(text(line, left, 30 + 12 * i));
//   }
//   return results;
// };

// const handleFlips = function handleFlips() {
//   let diff;
//   diff = lastRotation - player.rotation;
//   lastRotation = player.rotation;
//   if (diff > 0) {
//     backFlip += diff;
//     frontFlip = 0;
//   } else if (diff < 0) {
//     frontFlip -= diff;
//     backFlip = 0;
//   }
//   if (backFlip > 360 || frontFlip > 360) {
//     beepbeep.play();
//     backFlip = 0;
//     frontFlip = 0;
//     boost = min(maxBoost, boost + maxBoost * flipBoostMultiplier);
//   }
// };

// newObstacle = function (name) {
//   let obstacle; let obstacleColor; let
//     obstacleWidth;
//   obstacleWidth = undefined;
//   obstacleColor = undefined;
//   if (name === 'mine') {
//     obstacleWidth = mineWidth;
//     obstacleColor = mineColor;
//   } else {
//     obstacleWidth = pickupWidth;
//     obstacleColor = pickupColor;
//   }
//   obstacle = createSprite(player.position.x + width, random(20, opening), obstacleWidth, obstacleWidth);
//   obstacle.setCollider('circle', 0, 0, obstacleWidth / 2);
//   obstacle.draw = function () {
//     fill(obstacleColor);
//     ellipse(0, 0, obstacleWidth, obstacleWidth);
//     return noStroke();
//   };
//   return obstacle;
// };

// drawMarkers = function () {
//   let i; let left; let
//     leftSide;
//   leftSide = player.position.x - (width * 0.25);
//   i = 1;
//   while (i <= 10) {
//     left = leftSide + width * i / 10;
//     left -= leftSide % (width / 10);
//     rect(left, 10, 2, 10);
//     i++;
//   }
//   rect(leftSide + width - ((leftSide + width) % width), 10, 2, 25);
//   if (highScore > 0) {
//     left = exitXOffset + highScore;
//     rect(left, 10, 2, 50);
//     textAlign(LEFT);
//     text('High Score', left + 5, 50);
//   }
// };

// handleBoost = function () {
//   let multiplier; let x; let
//     y;
//   if ((keyDown(KEY.SPACE_BAR) || touchIsDown) && boost > 0) {
//     x = sin(radians(90 - player.rotation)) * playerWidth / 2;
//     y = cos(radians(90 - player.rotation)) * playerWidth / 2;
//     boostSprite.position.x = player.position.x - x;
//     boostSprite.position.y = player.position.y - y;
//     boostSprite.visible = true;
//     boostSprite.rotation = player.rotation;
//     multiplier = keyDown(KEY.SHIFT) ? slowSpeed : speed;
//     player.velocity.x = min(player.velocity.x + x * multiplier, maxSpeed);
//     player.velocity.y = min(player.velocity.y + y * multiplier, maxSpeed);
//     boost -= multiplier * 100;
//   } else {
//     boostSprite.visible = false;
//   }
// };

// window.touchStarted = function () {
//   if (gameOver) {
//     newGame();
//   }
// };

// window.convertAngle = function convertAngle(angle) {
//   if (angle < 0) {
//     return -angle;
//   }
//   if (phoneIsInverted) {
//     return angle;
//   }
//   return 180 - angle;
// };

// if (Modernizr.touch) {
//   gameWidth = screen.height;
//   gameHeight = screen.width;
//   $('body').css({
//     width: gameWidth,
//     height: gameHeight,
//   });
// } else {
//   $('body').addClass('no-touch');
// }

// const groundHeight = 5000;
// const groundWidth = 1000000000;
// const exitXOffset = 200;
// const opening = gameHeight - 50;
// // const orientation = undefined;
// const supportsOrientationChange = 'onorientationchange' in window;
// // const orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';
// const deviceRotation = undefined;

// if (supportsOrientationChange && Modernizr.touch) {
//   window.addEventListener('deviceorientation', ((e) => {
//     const { gamma } = e;
//     if (lastPhoneRotation < 0 && gamma > 0) {
//       phoneIsInverted = true;
//     } else if (lastPhoneRotation > 0 && gamma < 0) {
//       phoneIsInverted = false;
//     }
//     deviceRotation = convertAngle(gamma);
//     lastPhoneRotation = gamma;
//   }), false);
// }

// // ---
// // generated by coffee-script 1.9.2
