/// <reference types="svelte" />
import { Emojis } from './enums'

export type Cell = {
  emoji: Emojis,
  ageInGenerations: number,
}

export type ComparisonCell = {
  emoji: Emojis,
}

export type Row = Cell[]

export type GameBoard = Row[]

export type ComparisonGameBoard = ComparisonCell[][]

export type EvolutionOver = false | { message: string}
