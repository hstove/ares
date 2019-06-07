// import Modernizr from 'modernizr';

export default (s) => {
  let player;
  let ground;
  let ceiling;
  let boostSprite;
  let pickups;
  let mines;
  const playerWidth = 50;
  const playerHeight = 5;
  const maxSpeed = 5;
  const speed = 0.006;
  const slowSpeed = 0.003;
  const gravity = 0.04;
  const framesUntilMine = 100;
  const framesUntilPickup = 150;
  const mineWidth = 20;
  const pickupWidth = 40;
  const pickupColor = '#2980b9';
  const mineColor = '#e74c3c';
  let score = 0;
  let highScore = parseInt(localStorage[`highScore${speed}`], 10);
  const KEY = {};

  // if (Modernizr.localstorage && localStorage[`highScore${speed}`]) {
  //   highScore = parseInt(localStorage[`highScore${speed}`], 10);
  // }

  let gameOver = true;
  const maxBoost = 200;
  let boost = maxBoost;
  const flipBoostMultiplier = 0.25;
  const pickupBoostMultiplier = 0.1;
  let lastRotation;
  let startRotation;
  let frontFlip;
  let backFlip;
  const gameHeight = 600;
  const gameWidth = 800;
  const phoneIsInverted = false;
  const lastPhoneRotation = -45;
  let explosion = null;
  let beepbeep = null;

  const groundHeight = 5000;
  const groundWidth = 1000000000;
  const exitXOffset = 200;
  const opening = gameHeight - 50;
  // const orientation = undefined;
  const supportsOrientationChange = 'onorientationchange' in window;
  // const orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';
  const deviceRotation = undefined;

  document.ontouchstart = function onTouchStart(e) {
    e.preventDefault();
    return false;
  };

  document.ontouchmove = function onTouchMove(e) {
    e.preventDefault();
    return false;
  };

  const die = function die() {
    explosion.play();
    player.debug = true;
    gameOver = true;
    player.velocity.y = 0;
    return player.velocity.x = 0;
  };

  const drawScore = function drawScore() {
    let i; let j; let len; let line;
    s.textAlign(s.LEFT);
    const left = player.position.x - s.width * 0.25 + 5;
    s.fill('black');
    const lines = [`Score: ${score.toFixed()}`, `Boost: ${boost.toFixed()}`, `High Score: ${highScore.toFixed()}`];
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
    let obstacleColor; let
      obstacleWidth;
    if (name === 'mine') {
      obstacleWidth = mineWidth;
      obstacleColor = mineColor;
    } else {
      obstacleWidth = pickupWidth;
      obstacleColor = pickupColor;
    }
    const obstacle = s.createSprite(player.position.x + s.width, s.random(20, opening), obstacleWidth, obstacleWidth);
    obstacle.setCollider('circle', 0, 0, obstacleWidth / 2);
    obstacle.draw = function draw() {
      s.fill(obstacleColor);
      s.ellipse(0, 0, obstacleWidth, obstacleWidth);
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
      player.velocity.y = s.min(player.velocity.y + y * multiplier, maxSpeed);
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
    startRotation = deviceRotation;
    highScore = Math.max(score, highScore);
    localStorage[`highScore${speed}`] = highScore;
    score = 0;
    boost = maxBoost;
    resetPlayer();
    gameOver = false;
    lastRotation = 0;
    mines.removeSprites(true);
    return pickups.removeSprites(true);
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
    console.log(s);
    explosion = s.loadSound('/static/sounds/explosion.wav');
    beepbeep = s.loadSound('/static/sounds/beepbeep.wav');
  };

  s.setup = function setup() {
    // const createSprite = function createSprite(x, y, width, height) {
    //   console.log(s.createVector)
    //   const sprite = new Sprite(s, x, y, width, height);
    //   sprite.depth = this.allSprites.maxDepth() + 1;
    //   // this.allSprites.add(sprite);
    //   return sprite;
    // };
    explosion.setVolume(0.1);
    beepbeep.setVolume(0.1);
    KEY.SPACE_BAR = 32;
    s.createCanvas(gameWidth, gameHeight);
    pickups = new s.Group();
    mines = new s.Group();
    // console.log(s.createVector);
    player = s.createSprite(exitXOffset, opening, playerWidth, playerHeight);
    player.draw = function draw() {
      s.fill('#c0392b');
      s.rect(0, 0, playerWidth, playerHeight);
      s.fill('#2c3e50');
      s.rect(0, 0, s.min(playerWidth * boost / maxBoost, playerWidth), playerHeight);
    };
    resetPlayer();
    ground = s.createSprite(0, opening + groundHeight / 2, groundWidth, groundHeight);
    ground.draw = function draw() {
      s.fill('#8e44ad');
      s.rect(0, 0, groundWidth, groundHeight);
    };
    ceiling = s.createSprite(0, 0, groundWidth, 20);
    ceiling.draw = function draw() {
      s.rect(0, 0, groundWidth, 20);
    };
    boostSprite = s.createSprite(0, 0, 10, 10);
    boostSprite.visible = false;
    boostSprite.draw = function draw() {
      s.fill('#e74c3c');
      s.rect(0, 0, 10, 10);
    };
  };

  s.draw = function draw() {
    let adjustment; let i; let
      lines;
    s.background('#95a5a6');
    s.fill('#2c3e50');
    if (gameOver && s.keyWentDown(KEY.SPACE_BAR)) {
      newGame();
    }
    if (gameOver) {
      s.fill('#2c3e50');
      s.textAlign(s.CENTER);
      lines = ['You are stuck on Mars at Ares 3.', 'You need to get to Ares 4, which is far away to your right.', 'Go as far as you can without running out of feul', 'Pick up the blue things for feul', 'Do flips for more feul', 'Don\'t hit red things', 'Press Space Bar to Play'];
      i = 0;
      while (i < lines.length) {
        s.text(lines[i], player.position.x + s.width * 0.25, s.height / 2 + 14 * i);
        i++;
      }
    } else {
      player.debug = false;
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
      if (s.frameCount % framesUntilPickup === 0) {
        pickups.add(newObstacle('pickup'));
      }
      if (s.frameCount % framesUntilMine === 0) {
        mines.add(newObstacle('mine'));
      }
      handleBoost();
      player.velocity.y += gravity;
      player.velocity.x *= 0.999;
      score = player.position.x - exitXOffset;
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

  if (supportsOrientationChange && Modernizr.touch) {
    window.addEventListener('deviceorientation', ((e) => {
      const { gamma } = e;
      if (lastPhoneRotation < 0 && gamma > 0) {
        phoneIsInverted = true;
      } else if (lastPhoneRotation > 0 && gamma < 0) {
        phoneIsInverted = false;
      }
      deviceRotation = convertAngle(gamma);
      lastPhoneRotation = gamma;
    }), false);
  }

// ---
// generated by coffee-script 1.9.2

}