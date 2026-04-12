import type { Grid, MediaItem } from "../stores/grid.type"
import { GRID_SIZE } from "../stores/grid.util"

function makePresetItem(index: number): MediaItem {
	return {
		id: `preset-item-${index}`,
		title: `Album ${index + 1}`,
		subtitle: `Artist ${index + 1}`,
		coverUrl: `https://picsum.photos/seed/preset-${index}/200/200`,
	}
}

function buildGrid(filledCount: number): Grid {
	return Array.from({ length: GRID_SIZE }, (_unusedSlot, slotIndex) =>
		slotIndex < filledCount ? makePresetItem(slotIndex) : null,
	)
}

export const emptyGrid: Grid = buildGrid(0)
export const oneItemGrid: Grid = buildGrid(1)
export const partialGrid: Grid = buildGrid(13)
export const nearFullGrid: Grid = buildGrid(GRID_SIZE - 1)
export const fullGrid: Grid = buildGrid(GRID_SIZE)
