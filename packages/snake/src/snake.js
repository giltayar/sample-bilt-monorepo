import {randomBetween, range} from '@sample-bilt-monorepo/math-utils'

/**
 * @typedef {'north' | 'south' | 'east' | 'west'} Direction
 * @typedef {{x: number, y: number, char: string}} BoardItem
 * @typedef {{
 *  width: number
 *  height: number
 *  snake: BoardItem[]
 *  snakeDirection: Direction
 *  apples: BoardItem[]
 * }} Board
 */

/**
 * @param {number} height
 * @param {number} width
 */
export function makeBoard(height, width) {
  return {
    width,
    height,
    snake: [],
    snakeDirection: 'east',
    apples: [],
  }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {string} char
 * @returns {BoardItem}
 */
export function makeBoardItem(x, y, char) {
  return {x, y, char}
}

/**
 * @param {Board} board
 * @param {Direction} direction
 * @returns {Board}
 */
export function addInitialSnake(board, direction) {
  return {
    ...board,
    snake: [makeBoardItem((board.width / 2) | 0, (board.height / 2) | 0, headChar(direction))],
    snakeDirection: direction,
  }
}

/**
 * @param {Board} board
 * @returns {Board}
 */
export function addApple(board) {
  for (const _ of range(0, board.width * board.height)) {
    const x = randomBetween(0, board.width)
    const y = randomBetween(0, board.height)

    if (conflictsWith(x, y, board.apples) || conflictsWith(x, y, board.snake)) {
      continue
    }

    return {
      ...board,
      apples: [...(board?.apples ?? []), makeBoardItem(x, y, 'O')],
    }
  }

  throw new Error('could not find a good place for apple')
}

/**
 * @param {Direction} direction
 */
function headChar(direction) {
  switch (direction) {
    case 'north':
      return '^'
    case 'south':
      return 'v'
    case 'east':
      return '>'
    case 'west':
      return '<'
  }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {BoardItem[]} items
 */
function conflictsWith(x, y, items) {
  return !!items.find((item) => item.x === x && item.y === y)
}
