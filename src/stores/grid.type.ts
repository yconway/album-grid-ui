export interface MediaItem {
	id: string
	title: string
	subtitle: string // artist, author, director, etc. — whatever fits the media type
	coverUrl: string
}

/** A bounded list of media items, length ≤ GRID_SIZE. Empty positions are implicit. */
export type Grid = MediaItem[]

export interface GridStore {
	readonly slots: Grid
	addItem(item: MediaItem): void
	loadGrid(grid: Grid): void
	removeItem(index: number): void
	readonly isFull: boolean
}
