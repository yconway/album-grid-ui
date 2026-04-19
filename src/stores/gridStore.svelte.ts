import { addItem, isFull, removeItem } from "./grid.util"
import type { Grid, GridStore, MediaItem } from "./grid.type"

export function createGridStore(): GridStore {
	let grid = $state<Grid>([])
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

		removeItem(index: number): void {
			grid = removeItem(grid, index)
		},
	}
}

export const gridStore = createGridStore()
