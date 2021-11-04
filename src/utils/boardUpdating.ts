import _isEqual from 'lodash.isequal'
import type { GameBoard, Row, Cell } from '../global'
import { Emojis } from '../enums'
import { createNewCell, createDeadCell } from './boardCreation'

export const isAlive = (cell: Cell) =>
  cell !== undefined &&
  cell.emoji !== Emojis.dead &&
  cell.emoji !== Emojis.empty

type getNeighborCountFromRowArgs = {
  row: Row,
  targetCellIndex: number,
  rowIncludesTargetCell: boolean
}

const getNeighborCountFromRow = ({
  row,
  targetCellIndex,
  rowIncludesTargetCell = false
}: getNeighborCountFromRowArgs) => {
  let neighborCount = 0;

  for (let i = targetCellIndex - 1; i <= targetCellIndex + 1; i++) {
    if (isAlive(row[i])) {
      if (rowIncludesTargetCell) {
        // and is not target cell
        if (i !== targetCellIndex) {
          neighborCount += 1
        }
      } else {
        neighborCount += 1
      }
    }
  }

  return neighborCount
}

type getNeighborCountArgs = {
  gameBoard: GameBoard,
  y: number,
  x: number
}

const getNeighborCount = ({
  gameBoard,
  y: targetRowIndex,
  x: targetCellIndex,
}: getNeighborCountArgs) => {
  let neighborCount = 0;
  // loop over rows immediately surrounding the target cell 
  for (let i = -1; i <= 1; i++) {
    // if row exists (i.e. target row will not have one above it if it is the top row)
    if (gameBoard[targetRowIndex + i]) {
      const neighborCountFromRow = getNeighborCountFromRow({
        row: gameBoard[targetRowIndex + i],
        targetCellIndex,
        rowIncludesTargetCell: i === 0
      })

      neighborCount += neighborCountFromRow
    }
  }

  return neighborCount
}

const updateSurvivorEmoji = (ageInGenerations: number) => {
  if (ageInGenerations <= 5) return Emojis.baby
  if (ageInGenerations <= 10) return Emojis.man
  if (ageInGenerations <= 15) return Emojis.old
  
  return Emojis.wizard
}

export const updateGameBoard = (prevGameBoard: GameBoard) => {
  const newGameBoard: GameBoard = prevGameBoard.map(row =>
    row.map(cell => ({ ...cell }))
  )

  prevGameBoard.forEach((row, y) => {
    row.forEach((_, x) => {
      const neighborCount = getNeighborCount({
        gameBoard: prevGameBoard,
        y,
        x
      })
      
      if (isAlive(prevGameBoard[y][x])) {
        if (neighborCount < 2) {
          // 💀 any live cell with fewer than two live neighbours dies, as if by underpopulation
          newGameBoard[y][x] = createDeadCell()
        }

        if (neighborCount > 3) {
          // 💀 any live cell with more than three live neighbours dies, as if by overpopulation
          newGameBoard[y][x] = createDeadCell()
        }
        
        if (neighborCount === 2 || neighborCount === 3) {
          // 😀 any live cell with two or three live neighbours lives on to the next generation
          const ageInGenerations = prevGameBoard[y][x].ageInGenerations + 1

          newGameBoard[y][x] = {
            emoji: updateSurvivorEmoji(ageInGenerations),
            ageInGenerations,
          }
        }
        // cell is dead
      } else {
        if (neighborCount === 3) {
          // 🐣 any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction
          newGameBoard[y][x] = createNewCell()
        }

        if (newGameBoard[y][x].emoji === Emojis.dead) {
          newGameBoard[y][x].emoji = Emojis.empty
        }
      }
    })
  })

  return newGameBoard
}

const removeAgeInGenerations = (gameBoard: GameBoard) =>
  gameBoard.map(row =>
    row.map(cell => ({
      emoji: cell.emoji
    })
  ))

export const isEvolutionOver = (gameboardA: GameBoard, gameboardB: GameBoard) => {
  const gameBoardAWithoutAgeInGenerations = removeAgeInGenerations(gameboardA)
  const gameBoardBWithoutAgeInGenerations = removeAgeInGenerations(gameboardB)

  return _isEqual(gameBoardAWithoutAgeInGenerations, gameBoardBWithoutAgeInGenerations)
}
