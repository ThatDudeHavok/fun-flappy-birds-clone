// Create our 'main' state that will contain the game
var mainState = {
  preload: function () {
    // This function will be executed at the beginning
    // That's where we load the images and sound

    // Load the bird sprite
    game.load.image('bird', 'assets/bird.png');
    game.load.image('pipe', 'assets/pipe.png');

  },

  create: function () {
    // This function is called after the preload function
    // Here we set up the game, display sprites, etc.

    // Change the background color of the game toi blue
    game.stage.backgroundColor = '#71c5cf';

    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the bird at the position x=100 and y=245
    this.bird = game.add.sprite(100, 245, 'bird');

    // add physics to the bird
    // Needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.bird);

    // Hopefully this code will get the controller to work
    // this.indicator = game.add.sprite(10, 10, 'controller-indicator')
    // this.indicator.scale.x = indicator.scale.y = 2;
    // this.indicator.animations.frame = 1;

    game.input.gamepad.start();

    // Add gravity to the bird to make it fall
    // this.bird.body.gravity.y = 1000;

    // Call the 'jump' function when the spacekey is hit
    // var spaceKey = game.input.keyboard.addkey(Phaser.keyboard.SPACEBAR);
    var spaceKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);


    // Create an empty group
    // this.pipes = game.add.group();
    this.blocks = game.add.group();

    // this.timer = game.time.events.loop(900, this.addRowOfPipes, this);
    // this.timer = game.time.events.loop(200, this.addOnePipe, this)
    this.timer = game.time.events.loop(200, this.addKillBlock, this)

    // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where x = pad 1-4
    pad1 = game.input.gamepad.pad1;

    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {
      font: "30px Arial",
      fill: "#ffffff"
    })
  },


  addKillBlock: function () {

    var doomSpot = (Math.random() * 9) - 1;

    var block = game.add.sprite(800, doomSpot * 60 + 10, 'pipe');

    this.blocks.add(block);
    game.physics.arcade.enable(block);

    block.body.velocity.x = -200;

    block.checkWorldBounds = true;
    block.outOfBoundsKill = true;


    this.score += 1;
    this.labelScore.text = this.score;
  },

  addOnePipe: function (x, y) {
    // Create a pipe at the position x and y
    var pipe = game.add.sprite(x, y, 'pipe');

    // Add the pipe to our previously created group
    this.pipes.add(pipe);

    // Enable physics on the pipe
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200;

    // Automatically kill the pipe when it's no longer visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function () {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes
    // With one big hole at the position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1) {
        this.addOnePipe(400, i * 60 + 10);
      }
    }
    this.score += 1;
    this.labelScore.text = this.score;
  },

  update: function () {
    // This function is called 60 times per second
    // It contains the game's logic

    // If the bird is out of the screen (too high or too low)
    // Call the 'restartGame' function
    if (this.bird.y < 0 || this.bird.y > 490) {
      this.restartGame();
    }
    // if (game.input.gamepad.supported && game.input.gamepad.active && pad1.connected) {
    //     indicator.animations.frame = 0;
    // } else {
    //     indicator.animations.frame = 1;
    // }
    if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
   {
       this.bird.x--;
   }
   else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
   {
       this.bird.x++;
   }

   if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
   {
       this.bird.y--;
   }
   else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
   {
       this.bird.y++;
   }

   if (pad1.justPressed(Phaser.Gamepad.XBOX360_A))
   {
       this.bird.angle += 5;
   }

   if (pad1.justReleased(Phaser.Gamepad.XBOX360_B))
   {
       this.bird.scale.x += 0.01;
       this.bird.scale.y = this.bird.scale.x;
   }

   if (pad1.connected)
   {
       var rightStickX = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
       var rightStickY = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);

       if (rightStickX)
       {
           this.bird.x += rightStickX * 10;
       }

       if (rightStickY)
       {
           this.bird.y += rightStickY * 10;
       }
   }

  game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this)
  game.physics.arcade.overlap(this.bird, this.blocks, this.restartGame, null, this)
  },

  // Make the bird jump
  jump: function () {
    // Add a vertical velocity to the bird
    this.bird.body.velocity.y = -350
  },

  // Restart the game
  restartGame: function () {
    // Start the 'main' state, which restarts the game
    game.state.start('main');
  }
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(800, 490);
// game.scale.setGameSize(400, 490)

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');
