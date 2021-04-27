import {randomBetween, range} from '@sample-bilt-monorepo/math-utils'
import {produce} from 'immer'

/**
 * @typedef {'north' | 'south' | 'east' | 'west'} Direction
 * @typedef {'turn-to-north' | 'turn-to-south' | 'turn-to-east' | 'turn-to-west'} Command
 * @typedef {{x: number, y: number}}  BoardItem
 * @typedef {{
 *  width: number
 *  height: number
 *  snake: BoardItem[]
 *  snakeDirection: Direction
 *  apples: BoardItem[]
 *  commands: Command[]
 * }} Board
 */

/**
 * @param {number} height
 * @param {number} width
 * @returns {Board}
 */
export function makeBoard(height, width) {
  return {
    width,
    height,
    snake: [],
    snakeDirection: 'east',
    apples: [],
    commands: [],
  }
}

/**
 * @param {Board} board
 * @param {Direction} direction
 * @returns {Board}
 */
export function addInitialSnake(board, direction) {
  return {
    ...board,
    snake: [makeBoardItem((board.width / 2) | 0, (board.height / 2) | 0)],
    snakeDirection: direction,
  }
}

/**
 * @param {Board} board
 * @param {{TEST_BoardItem?: BoardItem}} options
 * @returns {Board}
 */
export function addApple(board, {TEST_BoardItem = undefined} = {}) {
  for (const _ of range(0, board.width * board.height)) {
    const x = (TEST_BoardItem || {}).x || randomBetween(0, board.width) | 0
    const y = (TEST_BoardItem || {}).y || randomBetween(0, board.height) | 0
    const newBoardItem = makeBoardItem(x,y)
    if (conflictsWith(newBoardItem, board.apples) || conflictsWith( newBoardItem, board.snake)) {
      continue
    }

    return {
      ...board,
      apples: [...(board?.apples ?? []), newBoardItem],
    }
  }

  throw new Error('could not find a good place for apple')
}

/**
 * @param {Board} board
 * @param {Command} command
 * @returns {Board}
 */
export function enqueueCommand(board, command) {
  return {...board, commands: [...board.commands, command]}
}

/**
 * @param {Board} board
 * @param {boolean} isSnakeLengtheningTick
 * @returns {{board: Board, hasCollided: boolean, isAlive: boolean}}
 */
export function executeTick(board, isSnakeLengtheningTick) {
  let hasCollided = false
  let isAlive = true
  const boardAfterTick = produce(board, (board) => {
    const snake = board.snake
    const tailOfSnake = snake[snake.length - 1]

    if (board.commands.length > 0) {
      board.snakeDirection = determineSnakeDirection(/**@type {Command}*/ (board.commands.shift()))
    }
    const collided = moveSnake(board.snake, board.snakeDirection, board.apples)

    if (outOfBounds(board, snake) || conflictsWith(snake[0], snake.slice(1))) {
      isAlive = false
      return
    }
    if (collided) {
      hasCollided = true
      return
    }

    if (isSnakeLengtheningTick) {
      snake.push(tailOfSnake)
    }
  })

  return {board: boardAfterTick, hasCollided, isAlive}
}

/**
 * @param {Board} board
 * @param {any} snake
 * @returns {boolean}
 */
function outOfBounds(board, snake) {
  return snake[0].x > board.width || snake[0].x < 0 || snake[0].y > board.height || snake[0].y < 0
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {BoardItem}
 */
function makeBoardItem(x, y) {
  return {x, y}
}

/**
 * @param {BoardItem} newItem
 * @param {BoardItem[]} items
 */
function conflictsWith( newItem, items) {
  return !!items.find((item) => item.x === newItem.x && item.y === newItem.y)
}

/**
 * @param {Command} command
 * @returns {Direction}
 */
function determineSnakeDirection(command) {
  switch (command) {
    case 'turn-to-north':
      return 'north'
    case 'turn-to-south':
      return 'south'
    case 'turn-to-east':
      return 'east'
    case 'turn-to-west':
      return 'west'
  }
}

/**
 * @param {import("immer/dist/internal").WritableDraft<BoardItem>[]} snake
 * @param {Direction} snakeDirection
 * @param {import("immer/dist/internal").WritableDraft<BoardItem>[]} apples
 * @returns {boolean}
 */

//

function moveSnake(snake, snakeDirection, apples) {
  const newSnakeHead = moveHead(snake[0], snakeDirection)
  const collidedWithAppleIndex = apples.findIndex(
    (apple) => apple.x === newSnakeHead.x && apple.y === newSnakeHead.y,
  )
  if (collidedWithAppleIndex !== -1) {
    apples.splice(collidedWithAppleIndex, 1)
  }
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = snake[i - 1]
  }

  snake[0] = newSnakeHead

  return collidedWithAppleIndex !== -1
}

/**
 * @param {import("immer/dist/internal").WritableDraft<BoardItem>} snakeHead
 * @param {Direction} snakeDirection
 */
function moveHead(snakeHead, snakeDirection) {
  switch (snakeDirection) {
    case 'north':
      return {...snakeHead, y: snakeHead.y - 1}
    case 'south':
      return {...snakeHead, y: snakeHead.y + 1}
    case 'west':
      return {...snakeHead, x: snakeHead.x - 1}
    case 'east':
      return {...snakeHead, x: snakeHead.x + 1}
  }
}
