import type { GameBoard } from './global'

// ================================================================================================= board creation utils =================================================================================================

const CHANCES_OF_LIFE = 0.3

const isAlive = () =>
  Math.random() <= CHANCES_OF_LIFE

const createRow = (length: number) => 
  new Array(length).fill(false).map(isAlive)

export const createGameBoard = (length = 5) =>
  new Array(length).fill(false).map(() => createRow(length))

// ================================================================================================= board updating logic =================================================================================================

const getNeighborCountFromRow = ({ row, targetCellIndex, rowIncludesTargetCell = false }) => {
  let neighborCount = 0;

  for (let i = targetCellIndex - 1; i <= targetCellIndex + 1; i++) {
    // current cell is alive
    if (row[i]) {
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

const getNeighborCount = ({
  gameBoard,
  y: targetRowIndex,
  x: targetCellIndex,
}) => {
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

export const updateGameBoard = (prevGameBoard: GameBoard) => {
  const newGameBoard: GameBoard = prevGameBoard.map(row => [...row])

  prevGameBoard.forEach((row, y) => {
    row.forEach((_, x) => {
      const neighborCount = getNeighborCount({
        gameBoard: prevGameBoard,
        y,
        x
      })
      // cell is alive
      if (prevGameBoard[y][x]) {
        if (neighborCount < 2) {
          console.log('any live cell with fewer than two live neighbours dies, as if by underpopulation')
          newGameBoard[y][x] = false
        }

        if (neighborCount > 3) {
          console.log('any live cell with more than three live neighbours dies, as if by overpopulation')
          newGameBoard[y][x] = false
        }
        
        if (neighborCount === 2 || neighborCount === 3) {
          console.log('any live cell with two or three live neighbours lives on to the next generation')
        }
        // cell is dead
      } else {
        if (neighborCount === 3) {
          console.log('any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction')
          newGameBoard[y][x] = true
        }
      }
    })
  })

  return newGameBoard
}
