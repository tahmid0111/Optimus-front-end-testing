// Tiny classnames joiner. Filters out falsy values so you can write
// cn('base', cond && 'extra', isX ? 'a' : 'b').
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
