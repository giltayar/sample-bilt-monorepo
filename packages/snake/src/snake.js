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

    if (conflictsWith(x, y, board.apples) || conflictsWith(x, y, board.snake)) {
      continue
    }

    return {
      ...board,
      apples: [...(board?.apples ?? []), makeBoardItem(x, y)],
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
 * @returns {{board: Board, hasCollided: boolean}}
 */
export function executeTick(board, isSnakeLengtheningTick) {
  let hasCollided = false
  const boardAfterTick = produce(board, (board) => {
    const snake = board.snake
    const tailOfSnake = snake[snake.length - 1]

    if (board.commands.length > 0) {
      board.snakeDirection = determineSnakeDirection(/**@type {Command}*/ (board.commands.shift()))
    }
    const collided = moveSnake(board.snake, board.snakeDirection, board.apples)

    if (collided) {
      hasCollided = true
      return
    }

    if (isSnakeLengtheningTick) {
      snake.push(tailOfSnake)
    }
  })

  return {board: boardAfterTick, hasCollided}
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
 * @param {number} x
 * @param {number} y
 * @param {BoardItem[]} items
 */
function conflictsWith(x, y, items) {
  return !!items.find((item) => item.x === x && item.y === y)
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
