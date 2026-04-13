export interface MediaItem {
	id: string
	title: string
	subtitle: string // artist, author, director, etc. — whatever fits the media type
	coverUrl: string
}

/** A bounded list of media items, length ≤ GRID_SIZE. Empty positions are implicit. */
export type Grid = MediaItem[]

// During a drag, svelte-dnd-action injects a shadow placeholder into the
// items array. It has the same shape as a real item plus a marker flag.
export type DndFilledItem = MediaItem & { isDndShadowItem?: boolean }

export interface GridStore {
	readonly slots: Grid
	addItem(item: MediaItem): void
	loadGrid(grid: Grid): void
	removeItem(index: number): void
	readonly isFull: boolean
}
