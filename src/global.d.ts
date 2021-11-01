/// <reference types="svelte" />

export enum Cell {
  dead = '💀',
  new = '🐣',
  survivor = '😀',
  empty = ''
}

export type Row = Cell[]
export type GameBoard = Row[]
