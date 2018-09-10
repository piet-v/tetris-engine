## tetris-engine 
### is the light-weight javascript library for developing custom tetris-game yourself

For development, you will need webpack.

### Get Started

```js
let Engine = require('tetris-engine').Engine;
 
//render tetris game
//it function executed every time when state of a game was changed
//gameState contains status of a game, 2D Array of objects 
//that specify square of a game area and next shape's description
//there is a information that can be used for render and 
//set different appearance for every square in the game area
//also gameState contains statistic that give you
//opportunity to charge points for a game
let renderFunc = gameState => {
   //You can render your tetris game by using react, vue etc or
   //use it on server and send render data to client
};
 
//defaultHeap is optional parameter. It represents 2-D array of 0 and 1. 
let defaultHeap = [
   [0, 0, 0, 0, 1, 1, 0],
   [0, 0, 0, 1, 1, 0, 0],
   [0, 0, 1, 1, 1, 1, 0]
];
 
//additionalShapes is optional parameter too. You can set it in the next example:
let additionalShapes = {
   MyShape1: [
      [0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 1, 0],
   ],
   MyShape2: [
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
   ]
};
```

You can set appearance for shapes in css, 
but you should specify this classes in rendering took them from gameState

```css
.shape.MyShape1 {
    background-color: red;
}

.heap.MyShape1 {
    background-color: pink;
}

.shape.MyShape2 {
    background-color: blue;
}

.heap.MyShape2 {
    background-color: lightblue;
}
```

### Create the game
```js
let areaHeight = 20;
let areaWidth = 15;

let game = new Engine(
   areaHeight, 
   areaWidth, 
   renderFunc, 
   defaultHeap, 
   additionalShapes
);

//For starting game process need run game.start();
//And run cycle that each iteration runs game.moveDown();
game.start();

let firstLevelInterval = 1000;
setInterval(() => {
   game.moveDown();
}, firstLevelInterval);


// Use
game.rotate();
game.rotateBack();
game.moveRight();
game.moveLeft(); 
game.moveDown();
game.pause();
game.start();

//for game managament
//You even use game.moveUp() for your custom game

```

### You can watch sample of using it with vue.js in https://github.com/petelinmn/tetris-engine-sample