import {
	addItem,
	createEmptyGrid,
	isFull,
	reorderSlot,
	removeItem,
	swapSlots,
	vacuumGrid,
} from "./grid"
import type { Grid, GridStore, MediaItem } from "./grid.type"

export type { Grid, GridSlot, MediaItem } from "./grid.type"

export function createGridStore(): GridStore {
	let grid = $state<Grid>(createEmptyGrid())

	return {
		get slots(): Grid {
			return grid
		},

		get isFull(): boolean {
			return isFull(grid)
		},

		addItem(item: MediaItem): void {
			grid = addItem(grid, item)
		},

		removeItem(index: number): void {
			grid = removeItem(grid, index)
		},

		vacuumGrid(): void {
			grid = vacuumGrid(grid)
		},

		swapSlots(indexA: number, indexB: number): void {
			grid = swapSlots(grid, indexA, indexB)
		},

		reorderSlot(fromIndex: number, toIndex: number): void {
			grid = reorderSlot(grid, fromIndex, toIndex)
		},
	}
}

export const gridStore = createGridStore()
