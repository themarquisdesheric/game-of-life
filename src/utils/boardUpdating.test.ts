import { createNewCell } from './boardCreation'
import { getNeighborCount, updateGameBoard } from './boardUpdating'
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

describe('updateGameBoard', () => {
  test('identity: i => i', () => {
    /*
      gameBoard: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]
    */
    const gameBoard = createEmptyGameBoard()

    const newGameBoard = updateGameBoard(gameBoard)

    expect(gameBoard).toEqual(newGameBoard)
  })

  test('💀 any live cell with fewer than two live neighbours dies, as if by underpopulation (zero neighbors)', () => {
    /*
      gameBoard: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]
    */
    const gameBoard = createEmptyGameBoard()

    gameBoard[1][1] = createNewCell()

    const newGameBoard = updateGameBoard(gameBoard)

    expect(newGameBoard[1][1].ageInGenerations).toBe(0)
    expect(newGameBoard).toMatchSnapshot()
  })

  test('💀 any live cell with fewer than two live neighbours dies, as if by underpopulation (one neighbor)', () => {
    /*
      gameBoard: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]
    */
    const gameBoard = createEmptyGameBoard()

    gameBoard[0][0] = createNewCell()
    gameBoard[1][1] = createNewCell()

    const newGameBoard = updateGameBoard(gameBoard)

    expect(newGameBoard[1][1].ageInGenerations).toBe(0)
    expect(newGameBoard).toMatchSnapshot()
  })

  test('💀 any live cell with more than three live neighbours dies, as if by overpopulation', () => {
    /*
      gameBoard: [
        [1, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ]
    */
    const gameBoard = createEmptyGameBoard()

    gameBoard[0][0] = createNewCell()
    gameBoard[0][1] = createNewCell()
    gameBoard[0][2] = createNewCell()
    gameBoard[1][0] = createNewCell()
    gameBoard[1][1] = createNewCell()
 
    const newGameBoard = updateGameBoard(gameBoard)

    expect(newGameBoard[1][1].ageInGenerations).toBe(0)
    expect(newGameBoard).toMatchSnapshot()
  })

  test('😀 any live cell with two or three live neighbours lives on to the next generation (two neighbors)', () => {
    /*
      gameBoard: [
        [1, 1, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]
    */
    const gameBoard = createEmptyGameBoard()

    gameBoard[0][0] = createNewCell()
    gameBoard[0][1] = createNewCell()
    gameBoard[1][1] = createNewCell()

    const newGameBoardWithTwoNeighbors = updateGameBoard(gameBoard)

    expect(newGameBoardWithTwoNeighbors[1][1].ageInGenerations).toBe(2)
    expect(newGameBoardWithTwoNeighbors).toMatchSnapshot()

    /*
      gameBoard: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
      ]
    */
    gameBoard[0][2] = createNewCell()

    const newGameBoardWithThreeNeighbors = updateGameBoard(gameBoard)

    expect(newGameBoardWithThreeNeighbors[1][1].ageInGenerations).toBe(2)
    expect(newGameBoardWithThreeNeighbors).toMatchSnapshot()
  })

  test('🐣 any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction', () => {
    /*
      gameBoard: [
        [0, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ]
    */
    const gameBoard = createEmptyGameBoard()

    gameBoard[0][1] = createNewCell()
    gameBoard[1][0] = createNewCell()
    gameBoard[1][1] = createNewCell()

    const newGameBoard = updateGameBoard(gameBoard)
    
    expect(newGameBoard[0][0].ageInGenerations).toBe(1)
    expect(newGameBoard).toMatchSnapshot()
  })
})

