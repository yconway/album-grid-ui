export interface MediaItem {
	id: string
	title: string
	subtitle: string // artist, author, director, etc. — whatever fits the media type
	coverUrl: string
}

/** Always exactly 25 slots. `null` = empty. */
export type GridSlot = MediaItem | null
export type Grid = GridSlot[] // length 25, indices 0–24

export interface GridStore {
	readonly slots: Grid
	addItem(item: MediaItem): void
	removeItem(index: number): void
	vacuumGrid(): void
	swapSlots(indexA: number, indexB: number): void
	reorderSlot(fromIndex: number, toIndex: number): void
	readonly isFull: boolean
}
