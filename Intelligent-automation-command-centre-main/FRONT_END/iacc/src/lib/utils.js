/**
 * Simple utility to merge class names
 * Filters out falsy values and joins with spaces
 */
export function cn(...inputs) {
    return inputs
        .flat()
        .filter(Boolean)
        .join(' ')
        .trim();
}
