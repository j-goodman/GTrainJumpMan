/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var renderZone = __webpack_require__(1);
	var Player = __webpack_require__(2);
	var Block = __webpack_require__(5);
	var View = __webpack_require__(6);
	var keyEvents = __webpack_require__(7);
	var blocks = __webpack_require__(4);
	
	window.onload = function () {
	  var canvas = document.getElementById("canvas");
	
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	var player = new Player (6*48, 8*48);
	keyEvents(document, player);
	
	var zoneOne = __webpack_require__(8);
	zoneOne.build(blocks);
	
	var view = new View (0, 0, 640, 480);
	
	  setInterval(function () {
	    ctx.fillStyle = "turquoise";
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	    blocks.forEach(function(block){
	      block.sprite.draw(ctx, block.pos, view.topLeftPos);
	    });
	
	    view.recenter(player.pos);
	
	    if (player.checkUnderFeet()) {
	      ctx.beginPath();
	      ctx.arc(80,40,8,0,2*Math.PI);
	      ctx.stroke();
	    }
	
	    player.sprite.draw(ctx, player.pos, view.topLeftPos);
	
	    player.drawData(ctx);
	
	    player.move();
	  }, 32);
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Player = __webpack_require__(2);
	var Block = __webpack_require__(5);
	
	renderZone = {
	  build: function (zone, canvas) {
	    zone.blueprint.forEach(function (string, yIndex) {
	      for (var xIndex=0; xIndex < string.length; xIndex++) {
	        switch (string.charAt(xIndex)) {
	          case "_":
	            break;
	          case "X":
	            zone.objects.push(new Block(xIndex, yIndex));
	            break;
	          case "!":
	            zone.objects.push(new Player(xIndex, yIndex));
	            break;
	        }
	      }
	    });
	  }
	};
	
	module.exports = renderZone;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var blocks = __webpack_require__(4);
	
	var Player = function (x, y) {
	  this.pos = {
	    x: x,
	    y: y
	  };
	};
	
	Player.prototype.runSpeed = 6;
	Player.prototype.jumpPower = 18;
	
	Player.prototype.facing = "right";
	
	Player.prototype.frame = "right";
	
	Player.prototype.speed = {
	  x: 0,
	  y: 0
	};
	
	Player.prototype.accel = {
	  x: 0,
	  y: 1
	};
	
	Player.prototype.sprites = {
	  standing_right: new Sprite(48, 48, 0, ["player/right/standing.gif"]),
	  jumping_right: new Sprite(48, 48, 0, ["player/right/jumping.gif"]),
	  standing_left: new Sprite(48, 48, 0, ["player/left/standing.gif"]),
	  jumping_left: new Sprite(48, 48, 0, ["player/left/jumping.gif"]),
	  running_right: new Sprite(48, 48, 4, [
	    "player/right/running/0.gif",
	    "player/right/running/1.gif",
	    "player/right/running/2.gif",
	    "player/right/running/3.gif"
	  ]),
	  running_left: new Sprite(48, 48, 4, [
	    "player/left/running/0.gif",
	    "player/left/running/1.gif",
	    "player/left/running/2.gif",
	    "player/left/running/3.gif"
	  ])
	};
	
	Player.prototype.sprite = Player.prototype.sprites.running_right;
	
	Player.prototype.move = function () {
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	  this.speed.x += this.accel.x;
	  this.speed.y += this.accel.y;
	  this.updateSprite();
	  this.landUnderFeet();
	};
	
	Player.prototype.landUnderFeet = function () {
	  var returnVal = false;
	  blocks.forEach(function (block) {
	    if (this.pos.x > block.pos.x - block.sprite.width &&
	        this.pos.x < block.pos.x + block.sprite.width &&
	        this.pos.y+this.sprite.height > block.pos.y-2 &&
	        this.pos.y+this.sprite.height < block.pos.y+block.sprite.height+2)
	    {
	      returnVal = true;
	      this.landOnGround(block);
	    }
	  }.bind(this));
	  return returnVal;
	};
	
	Player.prototype.checkUnderFeet = function () {
	  var returnVal = false;
	  blocks.forEach(function (block) {
	    if (this.pos.x > block.pos.x - block.sprite.width &&
	        this.pos.x < block.pos.x + block.sprite.width &&
	        this.pos.y+this.sprite.height > block.pos.y-4 &&
	        this.pos.y+this.sprite.height < block.pos.y+block.sprite.height)
	    {
	      returnVal = true;
	    }
	  }.bind(this));
	  return returnVal;
	};
	
	Player.prototype.landOnGround = function (block) {
	  if (this.speed.y > -1) {
	    this.speed.y = 0;
	  }
	  this.pos.y = block.pos.y-this.sprite.height;
	};
	
	Player.prototype.updateSprite = function () {
	  if (this.speed.x === 0) {
	    if (this.facing === "left") {
	      this.sprite = this.sprites.standing_left;
	    } else {
	      this.sprite = this.sprites.standing_right;
	    }
	  } else if (this.speed.x > 0) {
	    this.sprite = this.sprites.running_right;
	  } else if (this.speed.x < 0) {
	    this.sprite = this.sprites.running_left;
	  } if (!this.checkUnderFeet()) {
	    if (this.facing === "left") {
	      this.sprite = this.sprites.jumping_left;
	    } else {
	      this.sprite = this.sprites.jumping_right;
	    }
	  }
	};
	
	Player.prototype.xStop = function () {
	  if (this.pos.x%48===0) {
	    this.speed.x = 0;
	  } else {
	    setTimeout(this.xStop.bind(this), 16);
	  }
	};
	
	Player.prototype.drawData = function (ctx) {
	  ctx.font = "12px Courier";
	  ctx.strokeText("posX: "+this.pos.x+"("+Math.round(this.pos.x/48)+")", 12, 12);
	  ctx.strokeText("posY: "+this.pos.y+"("+Math.round(this.pos.y/48)+")", 12, 24);
	  ctx.strokeText("spdX: "+this.speed.x, 12, 36);
	  ctx.strokeText("spdY: "+this.speed.y, 12, 48);
	};
	
	module.exports = Player;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Sprite = function (width, height, frameDelay, sourcePathArray) {
	  this.frames = [];
	  this.width = width;
	  this.height = height;
	  this.frameDelay = 0;
	  this.frameDelayMax = frameDelay;
	  sourcePathArray.forEach(function(path, index){
	    this.frames[index] = new Image(width, height);
	    this.frames[index].src = "./sprites/"+path;
	  }.bind(this));
	};
	
	Sprite.prototype.frame = 0;
	
	Sprite.prototype.animate = function () {
	  if (this.frames.length > 1) {
	    if (this.frameDelay === 0) {
	        this.frame++;
	        if (this.frame === this.frames.length) {
	          this.frame = 0;
	        }
	    }
	    this.frameDelay-=1;
	    if (this.frameDelay < 0) {
	      this.frameDelay = this.frameDelayMax;
	    }
	  }
	};
	
	Sprite.prototype.draw = function (ctx, pos, viewAnchor) {
	  ctx.drawImage(
	    this.frames[this.frame],
	    pos.x-viewAnchor.x,
	    pos.y-viewAnchor.y,
	    this.width,
	    this.height
	  );
	  this.animate();
	};
	
	module.exports = Sprite;


/***/ },
/* 4 */
/***/ function(module, exports) {

	blocks = [];
	
	module.exports = blocks;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	
	var Block = function (x, y) {
	  this.pos = {
	    x: x,
	    y: y
	  };
	};
	
	Block.prototype.sprite = new Sprite(48, 48, 0, ["blocks/platform_surface.gif"]);
	
	module.exports = Block;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var View = function (topLeftX, topLeftY, bottomRightX, bottomRightY) {
	  this.topLeftPos = {x: topLeftX, y: topLeftY};
	  this.width = bottomRightX-topLeftX;
	  this.height = bottomRightY-topLeftY;
	};
	
	View.prototype.recenter = function (centerPos) {
	  this.topLeftPos.x = centerPos.x-this.width/2;
	  this.topLeftPos.y = centerPos.y-this.height/2;
	};
	
	module.exports = View;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var keyEvents = function (document, player) {
	  document.onkeydown = function (e) {
	    switch(e.keyCode) {
	    case 68: // d
	    case 39: //right
	      player.speed.x = player.runSpeed;
	      player.facing = "right";
	      break;
	    case 65: // a
	    case 37: //left
	      player.speed.x = 0-player.runSpeed;
	      player.facing = "left";
	      break;
	    case 87: // w
	    case 38: //up
	      if (player.checkUnderFeet()) {
	        player.speed.y = 0-player.jumpPower;
	      }
	      break;
	    }
	  };
	
	  document.onkeyup = function (e) {
	    switch(e.keyCode) {
	    case 68: // d
	    case 39: //right
	      if (player.speed.x > 0) { player.xStop(); }
	      break;
	    case 65: // a
	    case 37: //left
	      if (player.speed.x < 0) { player.xStop(); }
	      break;
	    }
	  };
	};
	
	module.exports = keyEvents;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(9);
	
	var zoneOne = new Zone ([
	  "------XXXXXXXXXXXXXXXXXXXXX----XXXXXXXX----XXXXXXXXXXXXX",
	  "XX------------------------------------------------------",
	  "--------------------------------------------------------",
	  "--------------------------------------------------------",
	  "XX------------------------------------------------------",
	  "--------------------------------------------------------",
	  "--------------------------XX----------------------------",
	  "XX----------XX----XXXXXX------X-------------------------",
	  "-----X-XX-----------------XX------XXX-------------------",
	  "---------------------------------------XX----XXX-X------",
	  "-----------------------------------------------------XXX",
	  "--------------------------------------------------------",
	  "--------------------------------------------------------",
	  "------------------------XXX--------------------XXXX-----",
	  "-XXXXXXXXXXXX--XXXXXXX--------XXXXX---X---XXX-----------"
	]);
	
	module.exports = zoneOne;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(5);
	
	var Zone = function (blueprint) {
	  this.blueprint = blueprint;
	};
	
	Zone.prototype.build = function (blocks) {
	  this.blueprint.forEach(function (yLine, yIndex) {
	    yLine.split("").forEach(function (square, xIndex) {
	      if (square === "X") {
	        blocks.push( new Block (xIndex*48, yIndex*48) );
	      }
	    });
	  });
	};
	
	module.exports = Zone;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map