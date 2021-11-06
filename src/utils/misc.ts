import { Emojis } from '../enums'

const colors = {
  [Emojis.baby]: 'bg-blue-400',
  [Emojis.man]: 'bg-purple-400',
  [Emojis.old]: 'bg-green-400',
  [Emojis.wizard]: 'bg-pink-400',
  [Emojis.dead]: '',
  [Emojis.empty]: '',
}

export const getBackgroundColor = (emoji: Emojis) =>
  colors[emoji]
