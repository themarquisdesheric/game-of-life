import { Emojis } from '../enums'

const CHANCES_OF_LIFE = 0.3

export const createNewCell = () => ({
  emoji: Emojis.baby,
  ageInGenerations: 1,
})

export const createEmptyCell = () => ({
  emoji: Emojis.empty,
  ageInGenerations: 0,
})

export const createDeadCell = () => ({
  emoji: Emojis.dead,
  ageInGenerations: 0,
})

const populateCell = () =>
  (Math.random() <= CHANCES_OF_LIFE)
    ? createNewCell()
    : createEmptyCell()

export const createRow = (length: number, empty = false) => 
  new Array(length)
    .fill(createEmptyCell())
    .map(empty ? createEmptyCell : populateCell)

export const createGameBoard = (length = 5) =>
  new Array(length)
    .fill(createEmptyCell())
    .map(() => createRow(length))
