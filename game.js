var Game, Hero, Monster, Bullet;

//====================================================================================
//	GAME CLASS
//====================================================================================
Game = (function(win, doc){

	function Game() {//game class
		this.canvas = document.createElement('canvas');//draw and instantiate game
		this.ctx = this.canvas.getContext('2d');//assign context to variable
		this.canvas.width = 512;
		this.canvas.height = 480;
		this.score = 0;
		this.livesRemaining = 3;
		this.isPaused = false;
		this.keysDown = [];//catching the keysdown method
		document.body.appendChild(this.canvas);//append game canvas to html
		return this;//
	}

	function handleKeyDown(e) {
		this.keysDown[e.keyCode] = true;
	}

	function handleKeyUp(e) {
		delete this.keysDown[e.keyCode];
	}

	Game.prototype = {//game methods!! initialize the game and return the properties
		'init': function() {
			this.assetsReady = {//returns false until the DOM oads
				'bgReady': false,
				'heroReady': false,
				'monsterReady': false,
				'bulletReady': false
			};

			this.hero = new Hero();//new class of hero
			this.monster = new Monster()
			this.bullet = [];

			this.attachEvents();//accessing global variable for key input

			return this;
		},

		'attachEvents': function() {
			var that = this;//make this a private class variable

			addEventListener('keydown', function(e){ handleKeyDown.call(that, e); }, false);
			addEventListener('keyup', function(e){ handleKeyUp.call(that, e); }, false);
		},

		'loadAssets': function() {
			var that = this;

			this.bgImage = new Image();
				this.bgImage.onload = function() {
					that.assetsReady.bgReady = true;
				};

			this.heroImage = new Image();
				this.heroImage.onload = function() {
					that.assetsReady.heroReady = true;
				};

			this.monsterImage = new Image();
				this.monsterImage.onload = function() {
					that.assetsReady.monsterReady = true;
				};
			this.bulletImage = new Image();
				this.bulletImage.onload = function() {
					that.assetsReady.bulletReady = true;
				};

			this.bgImage.src = 'images/stars-default.gif';//@TODO dopesnt work in firefox
			this.heroImage.src = 'images/hero2.png';
			this.monsterImage.src = 'images/monster2.png';
			this.bulletImage.src = "images/bullet2.png";
			
			return this;
		},

		'reset': function() { //every time new game or monster is hit
			/*this.hero.x = this.canvas.width / 2;
			this.hero.y = this.canvas.height / 2;*/
			// Throw the monster somewhere on the screen randomly
			this.monster.x = 32 + (Math.random() * (this.canvas.width - 64));
			this.monster.y = -32/*32 + (Math.random() * (this.canvas.height - 64));*/

			return this;
		},
		
		'gameOver': function() {
			alert("Game Over!");//then, reset the game
			this.livesRemaining = 3;
			this.score = 0;
		},
		
		'monsterHit': function() {
			this.score = this.score + 50;//increment global monsterscaught variable
			this.bullet = [];
			this.reset();
			var snd = new Audio("sounds/hitbaddie.mp3"); // buffers automatically when created
			snd.play();
		},
		
		'loseLife': function() {
			this.reset();
			this.livesRemaining--;
				if (this.livesRemaining == 0){//reset the game and start over
					this.gameOver();
				}
		},
		'render': function() {//drawing background and game sprites
			if(this.assetsReady.bgReady) {
				this.ctx.drawImage(this.bgImage, 0, 0);
			}

			if(this.assetsReady.heroReady) {
				this.ctx.drawImage(this.heroImage, this.hero.x, this.hero.y);
			}

			if(this.assetsReady.monsterReady) {
				this.ctx.drawImage(this.monsterImage, this.monster.x, this.monster.y);
			}
			if(this.assetsReady.bulletReady) {
				this.ctx.drawImage(this.bulletImage, this.bullet.x, this.bullet.y);
			}

			//Score
			this.ctx.fillStyle = 'rgb(0,250,154)';
			this.ctx.font = '24px Lucida Grande';
			this.ctx.textAlign = 'left';
			this.ctx.textBaseline = 'top';
			this.ctx.fillText('SCORE: ' + this.score + ' LIVES: ' +this.livesRemaining, 32, 32);//looks up value of monsterscaught variable

			return this;
		},

		'update': function(modifier) {//updates the game info
			// @TODO player movement should get its own function
			//Player is holding up
			/*if(38 in this.keysDown) {
				this.hero.y -= this.hero.speed * modifier;
			}

			//Player is holding down
			if(40 in this.keysDown) {
				this.hero.y += this.hero.speed * modifier;
			}*/
			//player holds space bar
			if(32 in this.keysDown) {
				new Bullet();// @todo one bullet does not replace the other
				this.bullet.x = this.hero.x + 20;
				this.bullet.y = this.hero.y + 8;
			}
			if(80 in this.keysDown) {//what is 80? its p!
				if(this.isPaused == false){
					this.isPaused = true
				}else if(this.isPaused == true){
					this.isPaused = false
				}
				this.keysDown = [];
			}


			//Player is holding left
			if(37 in this.keysDown) {
				this.hero.x -= this.hero.speed * modifier;
			}

			if(39 in this.keysDown) {
				this.hero.x += this.hero.speed * modifier;
			}

			//if the hero hit the left side
			//delete uneccessary
			if(this.hero.x/2 < 0) {
				this.hero.x = 0;
			}

			//if the hero hit the right side
			//delete uneccessary
			if(this.hero.x >= this.canvas.width - 32) {
				this.hero.x = this.canvas.width - 32;
			}

			//if hero hit the top
			if(this.hero.y <= 0) {
				this.hero.y = 0;
			}

			//if hero hit the bottom
			if(this.hero.y >= this.canvas.height - 32) {
				this.hero.y = this.canvas.height - 32;
			}

			//Are the hero and monsters touching?
			if (this.hero.x < (this.monster.x + 32) && this.monster.x < (this.hero.x + 32) && this.hero.y <= (this.monster.y + 32) && this.monster.y <= (this.hero.y + 32)) {
				this.loseLife();
			}
			
			//Did the bullet hit the monster?
			if (this.bullet && this.bullet.x < (this.monster.x + 15) && this.monster.x < (this.bullet.x + 15) && this.bullet.y <= (this.monster.y + 15) && this.monster.y <= (this.bullet.y + 15)) {
				this.monsterHit();
			}
			
			//Propel the bullet
			if(this.bullet){
				this.bullet.y = this.bullet.y-10;
			}
			
			//move the monster
			this.monster.y = this.monster.y+1;
			
			//if the monster hit the left side, reset the level and lose a life
			if(this.monster.y > this.canvas.height) {
				this.loseLife();
				this.reset();
			}

			//if the monster hit the right side, reverse x
			if(this.monster.x >= this.canvas.width - 32) {
				this.monster.x = this.monster.x-20;
			}
			/*
			//if monster hit the top
			if(this.monster.y <= 0) {
				this.monster.y = 0;
			}
			
			//if the monster hit the bottom
			if(this.monster.y >= this.canvas.height - 32) {
				this.monster.y = this.canvas.height - 32;
			}
			*/
			return this;//return itself
		},

		'run': function() {
			var now = Date.now(), delta = now - this.then;
			//if(!this.isPaused){
			this.update(delta / 1000);
			//}
			this.render();

			this.then = now;

			return this;
		}
	};

	return Game;//return values in game class

}(window, document));//i dont know what these arguments mean?!
//====================================================================================

//====================================================================================
//	HERO CLASS
//====================================================================================
Hero = (function(win, doc) {

	function Hero() {
		this.speed = 300;//256;
		this.x = 200;
		this.y = 400;
	}

	Hero.prototype = {//empty method?!

	};

	return Hero;

}(window, document));
//====================================================================================

//====================================================================================
//	MONSTER CLASS
//====================================================================================
Monster = (function(win, doc) {

	function Monster() {
		this.x = 0;
		this.y = 0;
		//this.direction = {"+", "-"};
	}

	Monster.prototype = {
	};

	return Monster;

}(window, document));
//====================================================================================
//====================================================================================
//	BULLET CLASS
//====================================================================================
Bullet = (function(win, doc) {

	function Bullet() {
		this.x = 0;
		this.y = 0;
	}

	Bullet.prototype = {

	};

	return Bullet;

}(window, document));
//====================================================================================



var game = new Game().init().loadAssets().reset();
	game.then = Date.now();
setInterval(function() { game.run(); }, 1);