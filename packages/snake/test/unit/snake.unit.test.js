import {describe, it} from 'mocha'
import {expect} from 'chai'
import {range} from '@sample-bilt-monorepo/math-utils'

import * as m from '../../src/snake.js'

describe('snake (unit)', function () {
  describe('add board items', () => {
    const initialBoard = m.makeBoard(30, 30)

    it('should locate snake in proper position', () => {
      expect(m.addInitialSnake(initialBoard, 'east').snake).to.eql([{x: 15, y: 15}])
    })

    it('should locate snake in proper position (on odd length board)', () => {
      expect(m.addInitialSnake(m.makeBoard(31, 31), 'east').snake).to.eql([{x: 15, y: 15}])
    })

    it('should add a random apple', () => {
      const boardWithApple = m.addApple(initialBoard)

      expect(boardWithApple.apples[0].x)
        .to.be.gte(0)
        .and.lt(boardWithApple.width)
        .and.satisfy(isWhole)
      expect(boardWithApple.apples[0].y)
        .to.be.gte(0)
        .and.lt(boardWithApple.height)
        .and.satisfy(isWhole)

      /**
       * @param {number} number
       */
      function isWhole(number) {
        return (number | 0) === number
      }
    })

    it('should add an apple that does not conflict with snake', () => {
      const boardWithSnake = m.addInitialSnake(initialBoard, 'east')
      for (const _ of range(0, 2000)) {
        const boardWithSnakeAndApple = m.addApple(boardWithSnake)
        const snake = m.addApple(boardWithSnake).snake

        expect(boardWithSnakeAndApple.apples)
          .to.have.length(1)
          .and.to.satisfy(
            (/** @type {import('../../src/snake.js').BoardItem[]} */ apples) =>
              apples[0].x != snake[0].x || apples[0].y != snake[0].y,
          )
      }
    })

    it('should enqueue one command or more', () => {
      const newBoard = m.enqueueCommand(initialBoard, 'turn-to-east')

      expect(newBoard.commands).to.eql(['turn-to-east'])

      const newerBoard = m.enqueueCommand(newBoard, 'turn-to-south')

      expect(newerBoard.commands).to.eql(['turn-to-east', 'turn-to-south'])
    })
  })

  describe('executeTick and direction commands)', () => {
    const initialBoard = m.addApple(m.addInitialSnake(m.makeBoard(30, 30), 'east'), {
      TEST_BoardItem: {x: 5, y: 5},
    })

    it('should move in the inertia direction if no commands', () => {
      const {board, hasCollided} = m.executeTick(initialBoard, false)

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([{x: 16, y: 15}])
    })

    it('should move twice in the inertia direction if no commands', () => {
      const {board, hasCollided} = m.executeTick(m.executeTick(initialBoard, false).board, false)

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([{x: 17, y: 15}])
    })

    it('should move in the enqueued command direction turn-to-south', () => {
      const commandedBoard = m.enqueueCommand(initialBoard, 'turn-to-south')
      const {board, hasCollided} = m.executeTick(commandedBoard, false)

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([{x: 15, y: 16}])
    })

    it('should move in the enqueued command direction turn-to-north', () => {
      const commandedBoard = m.enqueueCommand(initialBoard, 'turn-to-north')
      const {board, hasCollided} = m.executeTick(commandedBoard, false)

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([{x: 15, y: 14}])
    })

    it('should move in the enqueued command direction turn-to-west', () => {
      const commandedBoard = m.enqueueCommand(initialBoard, 'turn-to-west')
      const {board, hasCollided} = m.executeTick(commandedBoard, false)

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([{x: 14, y: 15}])
    })

    it('should move in the enqueued command direction turn-to-east', () => {
      const commandedBoard = m.enqueueCommand(initialBoard, 'turn-to-east')
      const {board, hasCollided} = m.executeTick(commandedBoard, false)

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([{x: 16, y: 15}])
    })

    it('should continuing moving if only one enqueud command', () => {
      const commandedBoard = m.enqueueCommand(initialBoard, 'turn-to-south')
      const {board, hasCollided} = m.executeTick(m.executeTick(commandedBoard, false).board, false)

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([{x: 15, y: 17}])
    })

    it('should switch twice if two  enqueud commands', () => {
      const commandedBoard = m.enqueueCommand(
        m.enqueueCommand(initialBoard, 'turn-to-south'),
        'turn-to-west',
      )
      const {board, hasCollided} = m.executeTick(m.executeTick(commandedBoard, false).board, false)

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([{x: 14, y: 16}])
    })
  })

  describe('lengthening the snake', () => {
    const initialBoard = m.addApple(m.addInitialSnake(m.makeBoard(30, 30), 'east'), {
      TEST_BoardItem: {x: 5, y: 5},
    })

    it('should enlarge in the inertia direction if no commands', () => {
      const {board, hasCollided} = m.executeTick(initialBoard, true)

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([
        {x: 16, y: 15},
        {x: 15, y: 15},
      ])
    })

    it('should enlarge even more in the inertia direction if no commands', () => {
      const {board, hasCollided} = m.executeTick(m.executeTick(initialBoard, true).board, true)

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([
        {x: 17, y: 15},
        {x: 16, y: 15},
        {x: 15, y: 15},
      ])
    })

    it('should enlarge even much more in the inertia direction if no commands', () => {
      const {board, hasCollided} = m.executeTick(
        m.executeTick(m.executeTick(initialBoard, true).board, true).board,
        true,
      )

      expect(hasCollided).to.be.false
      expect(board.apples).to.eql(initialBoard.apples)
      expect(board.snake).to.eql([
        {x: 18, y: 15},
        {x: 17, y: 15},
        {x: 16, y: 15},
        {x: 15, y: 15},
      ])
    })

    describe('lengthening the snake while turning', () => {
      const initialBoard = m.addApple(m.addInitialSnake(m.makeBoard(30, 30), 'east'), {
        TEST_BoardItem: {x: 5, y: 5},
      })
      const largerSnakeBoard = m.executeTick(
        m.executeTick(m.executeTick(initialBoard, true).board, true).board,
        true,
      ).board

      it('should turn and lengthen when small', () => {
        const enqueuedBoard = m.enqueueCommand(initialBoard, 'turn-to-south')

        const {board, hasCollided} = m.executeTick(enqueuedBoard, true)

        expect(hasCollided).to.be.false
        expect(board.apples).to.eql(initialBoard.apples)
        expect(board.snake).to.eql([
          {x: 15, y: 16},
          {x: 15, y: 15},
        ])
      })

      it('should turn and lengthen when large', () => {
        const enqueuedBoard = m.enqueueCommand(largerSnakeBoard, 'turn-to-south')

        const {board, hasCollided} = m.executeTick(enqueuedBoard, true)

        expect(hasCollided).to.be.false
        expect(board.apples).to.eql(initialBoard.apples)
        expect(board.snake).to.eql([
          {x: 18, y: 16},
          {x: 18, y: 15},
          {x: 17, y: 15},
          {x: 16, y: 15},
          {x: 15, y: 15},
        ])
      })

      it('should turn twice and lengthen when large', () => {
        const enqueuedBoard = m.enqueueCommand(
          m.enqueueCommand(largerSnakeBoard, 'turn-to-south'),
          'turn-to-east',
        )

        const {board, hasCollided} = m.executeTick(m.executeTick(enqueuedBoard, true).board, false)

        expect(hasCollided).to.be.false
        expect(board.apples).to.eql(initialBoard.apples)
        expect(board.snake).to.eql([
          {x: 19, y: 16},
          {x: 18, y: 16},
          {x: 18, y: 15},
          {x: 17, y: 15},
          {x: 16, y: 15},
        ])
      })
    })
  })
})
