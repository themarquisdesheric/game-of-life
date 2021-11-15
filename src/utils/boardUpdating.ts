import _isEqual from 'lodash.isequal'
import type { GameBoard, Row, Cell, ComparisonCell, ComparisonGameBoard } from '../global'
import { Emojis } from '../enums'
import { createNewCell, createDeadCell } from './boardCreation'

export const isAlive = (cell: Cell) =>
  cell !== undefined && cell.ageInGenerations

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

type removeAgeInGenerationsAndFlagCellsArgs = {
  gameBoard: GameBoard,
  checkForNonWizards?: boolean,
  emojiMode: boolean,
}

type removeAgeInGenerationsAndFlagCellsReturnType = {
  gameBoard: ComparisonGameBoard,
  nonWizardFound: boolean,
  liveCellsRemaining: boolean,
}

export const removeAgeInGenerationsAndFlagCells = ({
  gameBoard,
  checkForNonWizards = false,
  emojiMode
}: removeAgeInGenerationsAndFlagCellsArgs
): removeAgeInGenerationsAndFlagCellsReturnType => {
  let nonWizardFound = false
  let liveCellsRemaining = false

  const newGameBoard = gameBoard.map(row => 
    row.reduce(
      (accumulator: ComparisonCell[], cell: Cell) => {
        const isCellAlive = isAlive(cell)

        if (!liveCellsRemaining && isCellAlive) {
          liveCellsRemaining = true
        }

        if (!emojiMode) {
          accumulator.push({
            // retaining emoji structure for subsequent board comparison
            emoji: isCellAlive ? Emojis.baby : Emojis.empty,
          })

          return accumulator
        }
        
        if (checkForNonWizards && isCellAlive) {
          if (cell.emoji !== Emojis.wizard) {
            nonWizardFound = true
          }
        }

        accumulator.push({
          emoji: cell.emoji,
        })

        return accumulator
      }, []
    )
  )

  return {
    gameBoard: newGameBoard,
    nonWizardFound,
    liveCellsRemaining,
  }
}

export const messages = {
  evolutionOver: (generations: number, emojiMode: boolean) => {
    // emoji mode has an extra generation to show skull emoji
    generations = emojiMode ? generations : generations - 1

    return `Conditions were not right for this population to exist. They perished after ${generations} generations.`
  },
  generations: (generations: number) =>
    `${generations} generation${generations > 1 ? 's' : ''}`,
  prosperity: (generations: number) =>
    `It took ${generations} generations for this population to achieve prosperity. Their numbers remain constant, their ranks immortal.`,
  completeWizardhood: 'This population has achieved complete wizardhood. Their numbers remain constant, their ranks immortal.',
  infiniteLoop: 'This population has fallen into an infinite loop.',
}

type isEvolutionOverArgs = {
  newGameBoard: GameBoard,
  previousGameBoardsStore: {
    subscribe: (this: void, run: () => {}, invalidate?: () => {}) => () => {};
    add: (gameBoard: ComparisonGameBoard) => void;
  },
  previousGameBoards: ComparisonGameBoard[],
  generations: number,
  emojiMode: boolean,
}

export const isEvolutionOver = ({ newGameBoard, previousGameBoardsStore, previousGameBoards, generations, emojiMode }: isEvolutionOverArgs) => {
  const {
    gameBoard: newGameBoardNoAgeInGenerations,
    nonWizardFound,
    liveCellsRemaining,
  } = removeAgeInGenerationsAndFlagCells({
    gameBoard: newGameBoard,
    checkForNonWizards: true,
    emojiMode
  })

  if (!liveCellsRemaining) return {
    message: messages.evolutionOver(generations, emojiMode)
  }

  const [nMinusTwoGameBoard, nMinusOneGameBoard] = previousGameBoards
  
  previousGameBoardsStore.add(newGameBoardNoAgeInGenerations)
  
  // if in emoji mode, let evolution continue until remaining living cells have evolved into wizards
  if (emojiMode && nonWizardFound) return false
  
  // evolution has ended when gameboards cease to differ
  const boardsAreEqual = _isEqual(nMinusOneGameBoard, newGameBoardNoAgeInGenerations)
  // one form of infinite loop is recognized when the n - 2 and n gameboards match
  const inInfiniteLoop = _isEqual(nMinusTwoGameBoard, newGameBoardNoAgeInGenerations)

  if (inInfiniteLoop) return {
    message: messages.infiniteLoop,
  }

  if (boardsAreEqual) return {
    message: emojiMode ? messages.completeWizardhood : messages.prosperity(generations)
  }
  
  return false
}
