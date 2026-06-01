import shadowmageInfiltratorImg from '../assets/creature-shadowmage-infiltrator.webp'

const QUESTION_IMAGES = {
  'shadowmage-infiltrator': shadowmageInfiltratorImg,
}

export function getQuestionImage(imageKey) {
  return imageKey ? QUESTION_IMAGES[imageKey] : undefined
}

export default QUESTION_IMAGES
