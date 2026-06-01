import shadowmageInfiltratorImg from '../assets/creature-shadowmage-infiltrator.webp'
import shockImg from '../assets/instant-shock.jpg'
import cultivateImg from '../assets/sorcery-cultivate.jpg'
import giantGrowthImg from '../assets/instant-giant-growth.jpg'

const QUESTION_IMAGES = {
  'shadowmage-infiltrator': shadowmageInfiltratorImg,
  shock: shockImg,
  cultivate: cultivateImg,
  'giant-growth': giantGrowthImg,
}

export function getQuestionImage(imageKey) {
  return imageKey ? QUESTION_IMAGES[imageKey] : undefined
}

export default QUESTION_IMAGES
