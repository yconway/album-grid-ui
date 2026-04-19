import type { DndFilledItem, Grid, MediaItem } from "./grid.type"

const GRID_HEIGHT = 5
export const GRID_WIDTH = 5
export const GRID_SIZE = GRID_HEIGHT * GRID_WIDTH

/** Appends the item to the grid. Throws if the grid is full. */
export function addItem(grid: Grid, item: MediaItem): Grid {
	if (grid.length >= GRID_SIZE) {
		throw new Error("addItem: cannot add item to a full grid")
	}
	return [...grid, item]
}

/** Removes the item at `index`, shifting subsequent items left. */
export function removeItem(grid: Grid, index: number): Grid {
	if (index < 0 || index >= grid.length) {
		throw new RangeError(
			`removeItem: index ${index} is out of bounds for grid of length ${grid.length}`,
		)
	}
	const updated = [...grid]
	updated.splice(index, 1)
	return updated
}

export function isFull(grid: Grid): boolean {
	return grid.length === GRID_SIZE
}

/** Returns a new Grid with svelte-dnd-action's shadow placeholder removed. */
export function stripShadowItems(items: DndFilledItem[]): Grid {
	return items.filter((item) => item.isDndShadowItem !== true) as Grid
}
