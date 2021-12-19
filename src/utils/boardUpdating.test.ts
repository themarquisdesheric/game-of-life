import { createNewCell } from './boardCreation'
import { getNeighborCount } from './boardUpdating'
import { createEmptyGameBoard } from './test-utils'

describe('getNeighborCount', () => {
  test('empty board should return zero neighbors', () => {
    const gameBoard = createEmptyGameBoard()
    
    const neighborCount = getNeighborCount({
      gameBoard,
      x: 1,
      y: 1,
    })

    expect(neighborCount).toBe(0)
  })

  test('should return one neighbor', () => {
    const gameBoard = createEmptyGameBoard()
    
    gameBoard[0][0] = createNewCell()

    const neighborCount = getNeighborCount({
      gameBoard,
      x: 1,
      y: 1,
    })

    expect(neighborCount).toBe(1)
  })

  test('should return two neighbors', () => {
    const gameBoard = createEmptyGameBoard()
    
    gameBoard[0][0] = createNewCell()
    gameBoard[2][2] = createNewCell()

    const neighborCount = getNeighborCount({
      gameBoard,
      x: 1,
      y: 1,
    })

    expect(neighborCount).toBe(2)
  })
})
