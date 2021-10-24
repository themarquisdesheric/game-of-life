import type { GameBoard } from './global'

const isAlive = () =>
  Math.random() <= 0.3

const createRow = (length: number) => 
  new Array(length).fill('').map(isAlive)

export const createGameBoardRows = (length = 5) =>
  new Array(length).fill('').map(() => createRow(length))

export const updateGameBoard = (prevGameBoard: GameBoard) => {
  // any live cell with fewer than two live neighbours dies, as if by underpopulation.
  // any live cell with two or three live neighbours lives on to the next generation.
  // any live cell with more than three live neighbours dies, as if by overpopulation.
  // any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
}
