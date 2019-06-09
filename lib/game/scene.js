/* eslint-disable no-undef */
// import Modernizr from 'modernizr';

export default ({
  handleNewScore, highScore: _highScore, highScores, username,
}) => (s) => {
  let player;
  let ground;
  let ceiling;
  let boostSprite;
  let pickups;
  let mines;
  const playerWidth = 50;
  const playerHeight = 5;
  const maxSpeed = 6;
  const maxYSpeed = 4;
  const minYSpeed = -4;
  const speed = 0.006;
  const slowSpeed = 0.003;
  const gravity = 0.05;

  const startFramesUntilMine = 400;
  let framesUntilMine = 400;
  const framesUntilPickup = 250;
  const framesUntilNewMineDecay = 200;
  let lastMineFrame = 100;
  let lastPickupFrame = 100;
  let lastMineDecayFrame = 100;

  const mineWidth = 20;
  const mineDecay = 0.95;
  const pickupWidth = 40;
  // const pickupColor = '#2980b9';
  const pickupColor = '#1B9CFC';
  // const mineColor = '#e74c3c';
  const mineColor = '#FD7272';
  const boostColor = '#FC427B';
  let score = 0;
  let highScore = _highScore || 0;
  const KEY = {};
  let rollingFPS = [];
  const rollingFPSAverage = 20;

  let gameOver = true;
  const maxBoost = 200;
  let boost = maxBoost;
  const flipBoostMultiplier = 0.25;
  const pickupBoostMultiplier = 0.4;
  let lastRotation;
  let startRotation;
  let frontFlip;
  let backFlip;
  const gameHeight = 600;
  const gameWidth = 800;
  const phoneIsInverted = false;
  // const lastPhoneRotation = -45;
  let explosion = null;
  let beepbeep = null;
  // let bombImage;

  const groundHeight = 5000;
  const groundWidth = 1000000000;
  const exitXOffset = 200;
  const opening = gameHeight - 50;
  // const orientation = undefined;
  // const supportsOrientationChange = 'onorientationchange' in window;
  // const orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';
  let deviceRotation;

  document.ontouchstart = function onTouchStart(e) {
    e.preventDefault();
    return false;
  };

  document.ontouchmove = function onTouchMove(e) {
    e.preventDefault();
    return false;
  };

  const die = function die() {
    if (handleNewScore) {
      handleNewScore(score);
    }
    highScore = Math.max(score, highScore);
    // localStorage[`highScore${speed}`] = highScore;
    explosion.play();
    player.debug = true;
    gameOver = true;
    player.velocity.y = 0;
    player.velocity.x = 0;
    // mines.removeSprites(true);
    // pickups.removeSprites(true);
  };

  const getFPS = () => {
    const newFPS = s.frameRate();
    rollingFPS.push(newFPS);
    if (rollingFPS.length > rollingFPSAverage) {
      rollingFPS = rollingFPS.slice(1, rollingFPSAverage);
    }
    const sum = rollingFPS.reduce((prev, cur) => prev += cur, 0);
    return (sum / rollingFPS.length).toFixed();
  };

  const drawScore = function drawScore() {
    let i; let j; let len; let line;
    s.textAlign(s.LEFT);
    const left = player.position.x - s.width * 0.25 + 5;
    s.fill('black');
    const lines = [
      `Score: ${score.toFixed()}`,
      `Boost: ${boost.toFixed()}`,
      `High Score: ${highScore.toFixed()}`,
      `${getFPS()} FPS`,
    ];
    const results = [];
    for (i = j = 0, len = lines.length; j < len; i = ++j) {
      line = lines[i];
      results.push(s.text(line, left, 30 + 12 * i));
    }
    return results;
  };

  const handleFlips = function handleFlips() {
    const diff = lastRotation - player.rotation;
    lastRotation = player.rotation;
    if (diff > 0) {
      backFlip += diff;
      frontFlip = 0;
    } else if (diff < 0) {
      frontFlip -= diff;
      backFlip = 0;
    }
    if (backFlip > 360 || frontFlip > 360) {
      beepbeep.play();
      backFlip = 0;
      frontFlip = 0;
      boost = s.min(maxBoost, boost + maxBoost * flipBoostMultiplier);
    }
  };

  const newObstacle = function newObstacle(name) {
    let obstacleColor;
    let obstacleWidth;
    if (name === 'mine') {
      obstacleWidth = mineWidth;
      obstacleColor = mineColor;
    } else {
      obstacleWidth = pickupWidth;
      obstacleColor = pickupColor;
    }
    const obstacle = s.createSprite(player.position.x + s.width, s.random(20, opening), obstacleWidth, obstacleWidth);
    obstacle.setCollider('circle', 0, 0, obstacleWidth / 2);
    // if (name === 'mine') {
    //   obstacle.addImage(bombImage);
    // } else {

    // }
    obstacle.draw = function draw() {
      s.fill(obstacleColor);
      s.rect(0, 0, obstacleWidth, obstacleWidth);
      s.noStroke();
    };
    return obstacle;
  };

  const drawMarkers = function drawMarkers() {
    let i; let left;
    const leftSide = player.position.x - (s.width * 0.25);
    i = 1;
    while (i <= 10) {
      left = leftSide + s.width * i / 10;
      left -= leftSide % (s.width / 10);
      s.rect(left, 10, 2, 10);
      i++;
    }
    s.rect(leftSide + s.width - ((leftSide + s.width) % s.width), 10, 2, 25);
    if (highScore > 0) {
      left = exitXOffset + highScore;
      s.rect(left, 10, 2, 50);
      s.textAlign(s.LEFT);
      s.text('High Score', left + 5, 50);
    }
    highScores.forEach(({ attrs }) => {
      left = exitXOffset + attrs.score;
      if (username && attrs.username !== username) {
        s.rect(left, 10, 2, 50);
        s.textAlign(s.LEFT);
        s.text(attrs.username, left + 5, 50);
      }
    });
  };

  const handleBoost = function handleBoost() {
    let multiplier; let x; let
      y;
      // if ((s.keyDown(KEY.SPACE_BAR) || touchIsDown) && boost > 0) {
    if ((s.keyDown(KEY.SPACE_BAR)) && boost > 0) {
      x = s.sin(s.radians(90 - player.rotation)) * playerWidth / 2;
      y = s.cos(s.radians(90 - player.rotation)) * playerWidth / 2;
      boostSprite.position.x = player.position.x - x;
      boostSprite.position.y = player.position.y - y;
      boostSprite.visible = true;
      boostSprite.rotation = player.rotation;
      multiplier = s.keyDown(s.KEY.SHIFT) ? slowSpeed : speed;
      player.velocity.x = s.min(player.velocity.x + x * multiplier, maxSpeed);
      player.velocity.y = s.min(player.velocity.y + y * multiplier, maxYSpeed);
      player.velocity.y = s.max(player.velocity.y, minYSpeed);
      boost -= multiplier * 100;
    } else {
      boostSprite.visible = false;
    }
  };

  const resetPlayer = function resetPlayer() {
    player.rotation = -90;
    player.position.x = exitXOffset;
    player.position.y = opening - (playerWidth / 2) - 1;
  };

  const newGame = function newGame() {
    framesUntilMine = startFramesUntilMine;
    lastMineFrame = startFramesUntilMine;
    lastMineDecayFrame = framesUntilNewMineDecay;
    lastPickupFrame = framesUntilPickup;
    startRotation = deviceRotation;
    score = 0;
    boost = maxBoost;
    resetPlayer();
    player.debug = false;
    gameOver = false;
    lastRotation = 0;
    mines.removeSprites(true);
    pickups.removeSprites(true);
  };

  const clearOldSprites = function clearOldSprites() {
    let group; let i; let j; let len; let object; let ref; let
      results;
    if (s.frameCount % 50 !== 0) {
      return false;
    }
    ref = [mines, pickups];
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      group = ref[j];
      results.push((function makeResult() {
        let k; let len1; let
          results1;
        results1 = [];
        for (i = k = 0, len1 = group.length; k < len1; i = ++k) {
          object = group[i];
          if (object && object.position.x < (player.position.x - s.width)) {
            object.remove();
            results1.push(group.remove(object));
          } else {
            results1.push(undefined);
          }
        }
        return results1;
      })());
    }
    return results;
  };

  s.preload = function preload() {
    explosion = s.loadSound('/static/sounds/explosion.wav');
    beepbeep = s.loadSound('/static/sounds/beepbeep.wav');
    // bombImage = s.loadImage('/static/images/bomb-small.png');
  };

  s.setup = function setup() {
    explosion.setVolume(0.1);
    beepbeep.setVolume(0.1);
    s.frameRate(240);
    s.textFont('Space Mono');
    KEY.SPACE_BAR = 32;
    s.createCanvas(gameWidth, gameHeight);
    pickups = new s.Group();
    mines = new s.Group();
    player = s.createSprite(exitXOffset, opening, playerWidth, playerHeight);
    player.draw = function draw() {
      s.fill(boostColor);
      // s.fill('#c0392b');
      s.rect(0, 0, playerWidth, playerHeight);
      s.fill('#2c3e50');
      // s.fill(boostColor);
      s.rect(0, 0, s.min(playerWidth * boost / maxBoost, playerWidth), playerHeight);
    };
    resetPlayer();
    ground = s.createSprite(0, opening + groundHeight / 2, groundWidth, groundHeight);
    ground.draw = function draw() {
      // s.fill('#8e44ad');
      s.fill('#82589F');
      s.rect(0, 0, groundWidth, groundHeight);
    };
    ceiling = s.createSprite(0, 0, groundWidth, 20);
    ceiling.draw = function draw() {
      s.rect(0, 0, groundWidth, 20);
      s.fill('#2C3A47');
    };
    boostSprite = s.createSprite(0, 0, 10, 10);
    boostSprite.visible = false;
    boostSprite.draw = function draw() {
      s.fill(boostColor);
      s.rect(0, 0, 10, 10);
    };
  };

  s.draw = function draw() {
    let adjustment; let i; let
      lines;
      // s.background('#95a5a6');
    s.background('#CAD3C8');
    s.fill('#2c3e50');
    if (gameOver && s.keyWentDown(KEY.SPACE_BAR)) {
      newGame();
    }
    if (gameOver) {
      s.fill('#2c3e50');
      s.textAlign(s.CENTER);
      // lines = [
      //   'You are stuck on Mars at Ares 3.',
      //   'You need to get to Ares 4, which is far away to your right.',
      //   'Go as far as you can without running out of feul',
      //   'Pick up the blue things for feul',
      //   'Do flips for more feul',
      //   'Don\'t hit red things',
      //   'Press Space Bar to boost',
      //   'Use arrow keys to rotate',
      // ];
      lines = [
        'Press space bar to start',
      ];
      i = 0;
      while (i < lines.length) {
        s.text(lines[i], player.position.x + s.width * 0.25, s.height / 2 - 45 + 14 * i);
        i++;
      }
    } else {
      score = player.position.x - exitXOffset;
      if (player.collide(ceiling) || player.overlap(mines) || player.collide(ground)) {
        die();
      }
      if (deviceRotation) {
        adjustment = startRotation - deviceRotation;
        player.rotation += adjustment / 10;
      }
      if (s.keyDown(s.KEY.UP_ARROW) || s.keyDown(s.KEY.LEFT_ARROW)) {
        player.rotation += -5;
      } else if (s.keyDown(s.KEY.DOWN_ARROW) || s.keyDown(s.KEY.RIGHT_ARROW)) {
        player.rotation += 4;
      }
      player.overlap(pickups, (player, pickup) => {
        beepbeep.play();
        pickup.remove();
        boost = s.min(boost + maxBoost * pickupBoostMultiplier, maxBoost);
      });
      const delta = score;
      if (delta > (lastMineFrame + framesUntilMine)) {
        mines.add(newObstacle('mine'));
        lastMineFrame += framesUntilMine;
      }
      if (delta > (lastMineDecayFrame + framesUntilNewMineDecay)) {
        framesUntilMine *= mineDecay;
        lastMineDecayFrame += framesUntilNewMineDecay;
      }
      if (delta > (lastPickupFrame + framesUntilPickup)) {
        pickups.add(newObstacle('pickup'));
        lastPickupFrame += framesUntilPickup;
      }
      handleBoost();
      player.velocity.y += gravity;
      player.velocity.x *= 0.999;
      handleFlips();
    }
    drawScore();
    drawMarkers();
    s.drawSprites();
    clearOldSprites();
    s.camera.position.x = player.position.x + s.width / 4;
  };

  window.touchStarted = function () {
    if (gameOver) {
      newGame();
    }
  };

  window.convertAngle = function convertAngle(angle) {
    if (angle < 0) {
      return -angle;
    }
    if (phoneIsInverted) {
      return angle;
    }
    return 180 - angle;
  };

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
};
