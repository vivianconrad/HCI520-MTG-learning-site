/** Resolve card art under src/assets/cards/ */
export function cardImage(filename) {
  return new URL(`./${filename}`, import.meta.url).href
}
