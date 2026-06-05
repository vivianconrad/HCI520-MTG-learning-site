import { cardImage } from '../assets/cards/index.js'

const QUESTION_IMAGES = {
  'shadowmage-infiltrator': cardImage('creature-shadowmage-infiltrator.webp'),
  shock: cardImage('instant-shock.jpg'),
  cultivate: cardImage('sorcery-cultivate.jpg'),
  'giant-growth': cardImage('instant-giant-growth.jpg'),
}

export function getQuestionImage(imageKey) {
  return imageKey ? QUESTION_IMAGES[imageKey] : undefined
}

export default QUESTION_IMAGES
