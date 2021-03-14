import readline from 'readline'
import * as snake from '@sample-bilt-monorepo/snake'
import {delay} from '@sample-bilt-monorepo/promise-utils'

//

/**
 *
 * @param {{width: number, height: number, tick: number, 'num-ticks-to-lengthen': number}} options
 */
export default async function main({
  width,
  height,
  tick,
  'num-ticks-to-lengthen': numTicksToLengthen,
}) {
  let board = snake.addApple(snake.addInitialSnake(snake.makeBoard(height, width), 'east'))

  process.stdin.on('keypress', (ch) => {
    const command = KEY_TO_COMMAND[ch]
    if (command) {
      board = snake.enqueueCommand(board, command)
    }
  })
  readline.createInterface(process.stdin, process.stdout)

  for (let i = 1; ; ++i) {
    const {board: newBoard, hasCollided} = snake.executeTick(board, i % numTicksToLengthen === 0)
    board = hasCollided ? snake.addApple(newBoard) : newBoard

    showBoard(board)

    await delay(tick)
  }
}

/**
 * @param {snake.Board} board
 */
function showBoard(board) {
  console.clear()

  for (let row = 0; row < board.height; ++row) {
    for (let col = 0; col < board.width; ++col) {
      let char
      if (board.apples.find((apple) => apple.x === col && apple.y === row)) {
        char = 'O'
      } else {
        const segmentIndex = board.snake.findIndex(
          (segment) => segment.x === col && segment.y === row,
        )
        if (segmentIndex === 0) {
          char = SNAKE_DIRECTION_CHAR[board.snakeDirection]
        } else if (segmentIndex === board.snake.length - 1) {
          char = '+'
        } else if (segmentIndex !== -1) {
          char = '*'
        } else {
          char = '.'
        }
      }
      process.stdout.write(char)
    }
    process.stdout.write('\n')
  }
}

const KEY_TO_COMMAND = /**@type {Record<string, snake.Command>} */ ({
  w: 'turn-to-north',
  s: 'turn-to-south',
  d: 'turn-to-east',
  a: 'turn-to-west',
})

const SNAKE_DIRECTION_CHAR = /**@type {Record<snake.Direction, string>} */ ({
  north: '^',
  south: 'v',
  east: '>',
  west: '<',
})
