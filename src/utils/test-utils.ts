import type { GameBoard } from '../global'
import { createEmptyCell, createRow } from './boardCreation'

const BOARD_LENGTH = 3

export const createEmptyGameBoard = (boardLength = BOARD_LENGTH): GameBoard =>
  new Array(boardLength)
  .fill(createEmptyCell())
  .map(() => createRow(boardLength, true))
