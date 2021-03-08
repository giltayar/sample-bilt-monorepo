/**
 * @param {number} from
 * @param {number} to
 * @param {number} [step]
 *
 * @returns {number[]}
 */
export function range(from, to, step = 1) {
  if (from >= to) return []

  return Array(Math.ceil((to - from) / step))
    .fill(0)
    .map((_, i) => i * step + from)
}

/**
 *
 * @param {number} lower
 * @param {number} limit
 */
export function randomBetween(lower, limit) {
  return Math.random() * (limit - lower) + lower
}
