import { cardImage } from '../assets/cards/index.js'

const battlefieldSimpleImg = new URL('../assets/batrlefield-simple.jpg', import.meta.url).href

const QUESTION_IMAGES = {
  'battlefield-simple': battlefieldSimpleImg,
  'shadowmage-infiltrator': cardImage('creature-shadowmage-infiltrator.webp'),
  shock: cardImage('instant-shock.jpg'),
  cultivate: cardImage('sorcery-cultivate.jpg'),
  'giant-growth': cardImage('instant-giant-growth.jpg'),
  plains: cardImage('land-plains.webp'),
  mountain: cardImage('land-mountain.webp'),
  ajani: cardImage('planeswalker-ajani.webp'),
  liliana: cardImage('planeswalker-liliana-of-the-veil.jpg'),
  'alien-symbiosis': cardImage('enchantment-alien-symbiosis.webp'),
  'hyena-umbra': cardImage('enchantment-hyenaumbra.jpg'),
  'assassins-trophy': cardImage('instant-assassins-trophy.jpg'),
  'sol-ring': cardImage('artifact-sol-ring.jpg'),
  counterspell: cardImage('instant-counterspell.webp'),
  duress: cardImage('sorcery-duress.jpg'),
  island: cardImage('land-island.png'),
  'llanowar-elves': cardImage('creature-llanowar-elves.jpg'),
  nahiri: cardImage('planeswalker-nahiri.webp'),
  forest: cardImage('land-forest.jpg'),
  'woodland-cemetery': cardImage('land-woodland-cemetery.jpg'),
}

export function getQuestionImage(imageKey) {
  return imageKey ? QUESTION_IMAGES[imageKey] : undefined
}

export default QUESTION_IMAGES
