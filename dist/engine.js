import { Shape, ShapeDimension } from './shape';
import tetraShapes from './shapes/tetra-shapes';
import uglyShapes from './shapes/ugly-shapes';

/**
 * Implements the engine of a game
 */

export default class Engine {

  /**
   * Initializing new area
   * @param {*} width is the width of the field of the game in squares
   * @param {*} height is the height of the field of the game in squares
   * @param {*} renderHandle The method that will be runned every time when game state will be changed. 
   * Receives game render data.
   */
  constructor(width = 15, height = 20, renderHandle, defaultHeap) {
    if(width <= 0 || height <= 0)
      throw 'Size parameters of the game field are incorrect'

    this.width = width;
    this.height = height;

    this._shapesSet = {};
    for(let key in tetraShapes)
      this._shapesSet[key] = tetraShapes[key];

    for(let key in uglyShapes)
      this._shapesSet[key] = uglyShapes[key];

    this._newFigure();
    this._gameStatus = GAME_STATUS.INIT;

    //beta heap
    this._heap = [
      [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    let body = this.body;
    if(renderHandle) {
      renderHandle(body);
      this._renderHandle = renderHandle;
    }
  }

  /**
   * Creates a new Shape
   */
  _newFigure() {
    this._shape = this._nextShape ? this._nextShape : new Shape(this._shapesSet);
    this._nextShape = new Shape(this._shapesSet);
  }

  /**
   * Running a game or turn off a pause mode
   */
  start() {
    if(this._gameStatus !== GAME_STATUS.INIT && this._gameStatus !== GAME_STATUS.PAUSE)
      throw 'The game has been already runned!';

    if(this._gameStatus == GAME_STATUS.INIT) {
      this._newFigure();
    }

    this._gameStatus = GAME_STATUS.WORK;
    this._cycleId = setInterval(() => {
      //here must be a gravity emulator function

      //this._renderHandle(this.body);
    }, 1000);    
  }

  /**
   * Turn on a pause mode
   */
  pause() {
    if(this._gameStatus !== GAME_STATUS.WORK)
      throw 'The game isn\'t working!';

    this._gameStatus = GAME_STATUS.PAUSE;
  }

  moveLeft() {
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;

    if(!this._canShapeMove(0, -1))
      return;

    this._shape.position.X--;
    this._renderHandle(this.body);
  }

  moveRight() { 
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;

    if(!this._canShapeMove(0, 1))
      return;

    this._shape.position.X++;
    this._renderHandle(this.body);
  }

  moveUp() { 
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;
    if(!this._canShapeMove(1, 0))
      return;
    
    this._shape.position.Y++;
    this._renderHandle(this.body);
  }

  moveDown() { 
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;

    if(!this._canShapeMove(-1, 0)) {
      this._addShapeToHeap();
      return;
    }
      
    
    this._shape.position.Y--;
    this._renderHandle(this.body);
  }

  _addShapeToHeap() {
    this._newFigure();
    this._renderHandle(this.body);
        
  }

  rotate() { 
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;
    
    if(!this._canShapeMove(0, 0, this._shape.getRotatedBody()))
      return;
      
    this._shape.rotate();
    this._renderHandle(this.body);
  }

  rotateBack() { 
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;

    if(!this._canShapeMove(0, 0, this._shape.getRotatedBackBody()))
      return;
    
    this._shape.rotateBack();
    this._renderHandle(this.body);
  }

  _getShapeIndexX(x) {
    return x - this._shape.position.X;
  }

  _getShapeIndexY(y) {
    return this._shape.position.Y + (ShapeDimension - 1) - y;
  }

  _getAreaIndexXFromShape(shapeX, delta = 0) {
    return shapeX + this._shape.position.X + delta;
  }

  _getAreaIndexYFromShape(shapeY, delta = 0) {
      return this._shape.position.Y + (ShapeDimension - 1) - shapeY + delta;
  }

  /**
   * Specifies that can a shape move. 
   * If new coordinates of shape overlap with coordinates of heap 
   * or are outside the game area the shape can't move
   * @param {*} deltaY specifies vertical moving distance
   * @param {*} deltaX specifies horizontal moving distance
   * @param {*} shapeBody specifies changed body of a shape, for example rotated body
   */
  _canShapeMove(deltaY, deltaX, shapeBody) {
    if(!shapeBody)
      shapeBody = this._shape.body;

    for(let y = 0; y < shapeBody.length; y++) {
      let row = shapeBody[y];
      let areaIndexY = this._getAreaIndexYFromShape(y, deltaY);
      
      for(let x = 0; x < row.length; x++) {
        let cell = row[x];
        if(cell) {
          let areaIndexX = this._getAreaIndexXFromShape(x, deltaX);

          //check will the shape go over the walls and the ground
          if(areaIndexY < 0 || areaIndexX < 0 || areaIndexX >= this.width)
            return false;

          if(this._isHeapSquare(areaIndexY, areaIndexX ))
            return false;
        }
      }
    }

    return true;
  }

  _isSquareOfShape(y, x) {
      let row = this._shape.body[this._getShapeIndexY(y)];
      return row && row[this._getShapeIndexX(x)];
  }

  _isHeapSquare(y, x) {
    return this._heap[y] && this._heap[y][x];
  }

  _isLeftEdge(y, x) {
    return this._getShapeIndexX(x) == 0 && this._getShapeIndexY(y) >= 0 && this._getShapeIndexY(y) <= 4;
  }

  _isRightEdge(y, x) {
    return this._getShapeIndexX(x) == 4 && this._getShapeIndexY(y) >= 0 && this._getShapeIndexY(y) <= 4;
  }

  get body() {
    console.log(this._shape.position);
    let body = [];
    for (let y = this.height - 1; y >= 0; y--) {
        let row = [];
        for (let x = 0; x < this.width; x++) {
          row.push({
              val: this._isHeapSquare(y, x) ? 2 : this._isSquareOfShape(y, x) ? 1 : 0,
              x: x,
              y: y,
              isLeftEdge: this._isLeftEdge(y, x),
              isRightEdge: this._isRightEdge(y, x)
          });
        }
        body.push(row);
    }
    return body;
  }
}

/**
 * Enum represents status of a game
 * 
 * INIT - game was not started
 * WORK - game is running
 * PAUSE - game was timely stopped
 * OVER - game was finished
 */
const GAME_STATUS = {
  INIT: 0,
  WORK: 1,
  PAUSE: 2,
  OVER: 3
}