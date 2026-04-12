import compact from "lodash/compact"
import type { Grid, GridSlot, MediaItem } from "./grid.type"

const GRID_HEIGHT = 5
export const GRID_WIDTH = 5
export const GRID_SIZE = GRID_HEIGHT * GRID_WIDTH

export function createEmptyGrid(): Grid {
	return Array<GridSlot>(GRID_SIZE).fill(null)
}

/** Adds item to the first empty slot. Throws if the grid is full. */
export function addItem(grid: Grid, item: MediaItem): Grid {
	const firstEmptyIndex = grid.findIndex((slot) => slot === null)
	if (firstEmptyIndex === -1) {
		throw new Error("addItem: cannot add item to a full grid")
	}
	const updated = [...grid]
	updated[firstEmptyIndex] = item
	return updated
}

/** Clears the slot at `index`, leaving all other slots in place. */
export function removeItem(grid: Grid, index: number): Grid {
	if (index < 0 || index >= grid.length) {
		throw new RangeError(
			`removeItem: index ${index} is out of bounds for grid of length ${grid.length}`,
		)
	}
	const updated = [...grid]
	updated[index] = null
	return updated
}

/** Shifts all items to the front of the array, filling trailing slots with null. */
export function vacuumGrid(grid: Grid): Grid {
	const items = compact(grid)
	return [...items, ...Array<GridSlot>(GRID_SIZE - items.length).fill(null)]
}

/** True swap: A goes to B's position, B goes to A's position. */
export function swapSlots(grid: Grid, indexA: number, indexB: number): Grid {
	if (
		indexA < 0 ||
		indexA >= grid.length ||
		indexB < 0 ||
		indexB >= grid.length
	) {
		throw new RangeError(
			`swapSlots: indices ${indexA} and ${indexB} must be within [0, ${grid.length - 1}]`,
		)
	}
	const updated = [...grid]
	// Bounds check above guarantees these indices are valid.
	const slotA = updated[indexA]!
	const slotB = updated[indexB]!
	updated[indexA] = slotB
	updated[indexB] = slotA
	return updated
}

/**
 * Insert-style reorder: removes the item at `fromIndex` and inserts it at `toIndex`,
 * shifting items between the two positions to fill the gap.
 *
 * Example: reorderSlot([A, B, C, ...], 0, 2) → [B, C, A, ...]
 */
export function reorderSlot(
	grid: Grid,
	fromIndex: number,
	toIndex: number,
): Grid {
	if (
		fromIndex < 0 ||
		fromIndex >= grid.length ||
		toIndex < 0 ||
		toIndex >= grid.length
	) {
		throw new RangeError(
			`reorderSlot: indices ${fromIndex} and ${toIndex} must be within [0, ${grid.length - 1}]`,
		)
	}
	if (fromIndex === toIndex) {
		return grid
	}
	const updated = [...grid]
	const removed: GridSlot = updated.splice(fromIndex, 1)[0] ?? null
	updated.splice(toIndex, 0, removed)
	return updated
}

export function isFull(grid: Grid): boolean {
	return grid.every((slot) => slot !== null)
}
