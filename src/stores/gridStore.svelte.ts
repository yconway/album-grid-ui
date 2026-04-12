import {
	addItem,
	createEmptyGrid,
	isFull,
	reorderSlot,
	removeItem,
	swapSlots,
	vacuumGrid,
} from "./grid.util"
import type { Grid, GridStore, MediaItem } from "./grid.type"

export function createGridStore(): GridStore {
	let grid = $state<Grid>(createEmptyGrid())
	const gridIsFull = $derived(isFull(grid))

	return {
		get slots(): Grid {
			return grid
		},

		get isFull(): boolean {
			return gridIsFull
		},

		addItem(item: MediaItem): void {
			grid = addItem(grid, item)
		},

		loadGrid(newGrid: Grid): void {
			grid = newGrid
		},

		/** vacuums grid after removing the item. */
		removeItem(index: number): void {
			grid = vacuumGrid(removeItem(grid, index))
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
