import { Emojis } from '../enums'

const colors = {
  [Emojis.baby]: '#01a2e1',
  [Emojis.man]: '#9b3ce9',
  [Emojis.old]: '#fad20b',
  [Emojis.wizard]: '#fd3a3a',
  [Emojis.dead]: '',
  [Emojis.empty]: '',
}

export const getBackgroundColor = (emoji: Emojis) =>
  colors[emoji]
