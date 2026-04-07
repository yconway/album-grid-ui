import { describe, expect, it } from "vitest"
import {
	addItem,
	createEmptyGrid,
	isFull,
	reorderSlot,
	removeItem,
	swapSlots,
	vacuumGrid,
} from "./grid"
import type { Grid, MediaItem } from "./grid.type"

function makeItem(id: string): MediaItem {
	return {
		id,
		title: `Title ${id}`,
		subtitle: `Subtitle ${id}`,
		coverUrl: `https://example.com/${id}.jpg`,
	}
}

// Build a sparse grid with items at specific indices for easy test setup.
function makeGrid(entries: Record<number, MediaItem>): Grid {
	const grid = createEmptyGrid()
	for (const [index, item] of Object.entries(entries)) {
		grid[Number(index)] = item
	}
	return grid
}

const itemA = makeItem("a")
const itemB = makeItem("b")
const itemC = makeItem("c")

describe("createEmptyGrid", () => {
	it("creates a grid of 25 null slots", () => {
		const grid = createEmptyGrid()
		expect(grid).toHaveLength(25)
		expect(grid.every((slot) => slot === null)).toBe(true)
	})
})

describe("addItem", () => {
	it("fills the first empty slot", () => {
		const grid = createEmptyGrid()
		const updated = addItem(grid, itemA)
		expect(updated[0]).toBe(itemA)
		expect(updated.slice(1).every((slot) => slot === null)).toBe(true)
	})

	it("fills the next empty slot when earlier slots are occupied", () => {
		const grid = makeGrid({ 0: itemA, 1: itemB })
		const updated = addItem(grid, itemC)
		expect(updated[2]).toBe(itemC)
	})

	it("throws when the grid is full", () => {
		const fullGrid = Array(25).fill(itemA) as Grid
		expect(() => addItem(fullGrid, itemB)).toThrow(Error)
	})

	it("does not mutate the original grid", () => {
		const grid = createEmptyGrid()
		addItem(grid, itemA)
		expect(grid[0]).toBeNull()
	})
})

describe("removeItem", () => {
	it("clears the slot at the given index", () => {
		const grid = makeGrid({ 0: itemA, 1: itemB })
		const updated = removeItem(grid, 0)
		expect(updated[0]).toBeNull()
		expect(updated[1]).toBe(itemB)
	})

	it("leaves all other slots unchanged", () => {
		const grid = makeGrid({ 5: itemA })
		const updated = removeItem(grid, 5)
		expect(updated[5]).toBeNull()
		expect(updated.filter((slot) => slot !== null)).toHaveLength(0)
	})

	it("does not vacuum — other items stay in place", () => {
		const grid = makeGrid({ 0: itemA, 2: itemB })
		const updated = removeItem(grid, 0)
		expect(updated[0]).toBeNull()
		expect(updated[2]).toBe(itemB)
	})

	it("does not mutate the original grid", () => {
		const grid = makeGrid({ 0: itemA })
		removeItem(grid, 0)
		expect(grid[0]).toBe(itemA)
	})

	it("throws when index is past the end of the grid", () => {
		expect(() => removeItem(createEmptyGrid(), 25)).toThrow(RangeError)
	})

	it("throws when index is negative", () => {
		expect(() => removeItem(createEmptyGrid(), -1)).toThrow(RangeError)
	})
})

describe("vacuumGrid", () => {
	it("compacts non-null items to the front", () => {
		const grid = makeGrid({ 0: itemA, 2: itemB, 4: itemC })
		const updated = vacuumGrid(grid)
		expect(updated[0]).toBe(itemA)
		expect(updated[1]).toBe(itemB)
		expect(updated[2]).toBe(itemC)
		expect(updated.slice(3).every((slot) => slot === null)).toBe(true)
	})

	it("preserves the order of non-null items", () => {
		const grid = makeGrid({ 1: itemC, 3: itemA, 5: itemB })
		const updated = vacuumGrid(grid)
		expect(updated[0]).toBe(itemC)
		expect(updated[1]).toBe(itemA)
		expect(updated[2]).toBe(itemB)
	})

	it("is a no-op on an already-compact grid", () => {
		const grid = makeGrid({ 0: itemA, 1: itemB })
		const updated = vacuumGrid(grid)
		expect(updated[0]).toBe(itemA)
		expect(updated[1]).toBe(itemB)
	})

	it("returns 25 null slots for an empty grid", () => {
		const updated = vacuumGrid(createEmptyGrid())
		expect(updated).toHaveLength(25)
		expect(updated.every((slot) => slot === null)).toBe(true)
	})

	it("does not mutate the original grid", () => {
		const grid = makeGrid({ 2: itemA })
		vacuumGrid(grid)
		expect(grid[0]).toBeNull()
		expect(grid[2]).toBe(itemA)
	})
})

describe("swapSlots", () => {
	it("exchanges two occupied slots", () => {
		const grid = makeGrid({ 0: itemA, 1: itemB })
		const updated = swapSlots(grid, 0, 1)
		expect(updated[0]).toBe(itemB)
		expect(updated[1]).toBe(itemA)
	})

	it("moves an item into a null slot and clears the source", () => {
		const grid = makeGrid({ 0: itemA })
		const updated = swapSlots(grid, 0, 5)
		expect(updated[0]).toBeNull()
		expect(updated[5]).toBe(itemA)
	})

	it("swaps two null slots (no-op in effect)", () => {
		const grid = createEmptyGrid()
		const updated = swapSlots(grid, 0, 1)
		expect(updated[0]).toBeNull()
		expect(updated[1]).toBeNull()
	})

	it("works with non-adjacent indices", () => {
		const grid = makeGrid({ 3: itemA, 24: itemB })
		const updated = swapSlots(grid, 3, 24)
		expect(updated[3]).toBe(itemB)
		expect(updated[24]).toBe(itemA)
	})

	it("does not mutate the original grid", () => {
		const grid = makeGrid({ 0: itemA, 1: itemB })
		swapSlots(grid, 0, 1)
		expect(grid[0]).toBe(itemA)
		expect(grid[1]).toBe(itemB)
	})

	it("throws when either index is past the end of the grid", () => {
		expect(() => swapSlots(createEmptyGrid(), 0, 25)).toThrow(RangeError)
		expect(() => swapSlots(createEmptyGrid(), 25, 0)).toThrow(RangeError)
	})

	it("throws when either index is negative", () => {
		expect(() => swapSlots(createEmptyGrid(), -1, 0)).toThrow(RangeError)
		expect(() => swapSlots(createEmptyGrid(), 0, -1)).toThrow(RangeError)
	})
})

describe("reorderSlot", () => {
	it("moves an item forward, shifting items in between left", () => {
		// [A, B, C, ...] → reorderSlot(0, 2) → [B, C, A, ...]
		const grid = makeGrid({ 0: itemA, 1: itemB, 2: itemC })
		const updated = reorderSlot(grid, 0, 2)
		expect(updated[0]).toBe(itemB)
		expect(updated[1]).toBe(itemC)
		expect(updated[2]).toBe(itemA)
	})

	it("moves an item backward, shifting items in between right", () => {
		// [A, B, C, ...] → reorderSlot(2, 0) → [C, A, B, ...]
		const grid = makeGrid({ 0: itemA, 1: itemB, 2: itemC })
		const updated = reorderSlot(grid, 2, 0)
		expect(updated[0]).toBe(itemC)
		expect(updated[1]).toBe(itemA)
		expect(updated[2]).toBe(itemB)
	})

	it("is a no-op when fromIndex equals toIndex", () => {
		const grid = makeGrid({ 3: itemA })
		const updated = reorderSlot(grid, 3, 3)
		expect(updated).toBe(grid)
	})

	it("moves null slots the same as occupied slots", () => {
		const grid = makeGrid({ 1: itemA, 2: itemB })
		// Move the null at 0 to position 2, shifting A and B left
		const updated = reorderSlot(grid, 0, 2)
		expect(updated[0]).toBe(itemA)
		expect(updated[1]).toBe(itemB)
		expect(updated[2]).toBeNull()
	})

	it("preserves grid length", () => {
		const grid = makeGrid({ 0: itemA, 24: itemB })
		const updated = reorderSlot(grid, 0, 24)
		expect(updated).toHaveLength(25)
	})

	it("correctly moves from the first to the last position", () => {
		const grid = makeGrid({ 0: itemA, 24: itemB })
		const updated = reorderSlot(grid, 0, 24)
		// A removed from 0; remaining items shift left; A inserted at 24
		expect(updated[23]).toBe(itemB)
		expect(updated[24]).toBe(itemA)
	})

	it("correctly moves from the last to the first position", () => {
		const grid = makeGrid({ 0: itemA, 24: itemB })
		const updated = reorderSlot(grid, 24, 0)
		// B removed from 24; inserted at 0; A shifts right to 1
		expect(updated[0]).toBe(itemB)
		expect(updated[1]).toBe(itemA)
	})

	it("does not mutate the original grid", () => {
		const grid = makeGrid({ 0: itemA, 1: itemB })
		reorderSlot(grid, 0, 1)
		expect(grid[0]).toBe(itemA)
		expect(grid[1]).toBe(itemB)
	})

	it("throws when either index is past the end of the grid", () => {
		expect(() => reorderSlot(createEmptyGrid(), 0, 25)).toThrow(RangeError)
		expect(() => reorderSlot(createEmptyGrid(), 25, 0)).toThrow(RangeError)
	})

	it("throws when either index is negative", () => {
		expect(() => reorderSlot(createEmptyGrid(), -1, 0)).toThrow(RangeError)
		expect(() => reorderSlot(createEmptyGrid(), 0, -1)).toThrow(RangeError)
	})
})

describe("isFull", () => {
	it("returns false for an empty grid", () => {
		expect(isFull(createEmptyGrid())).toBe(false)
	})

	it("returns false when at least one slot is empty", () => {
		const grid = Array(25).fill(itemA) as Grid
		grid[24] = null
		expect(isFull(grid)).toBe(false)
	})

	it("returns true when all 25 slots are occupied", () => {
		const fullGrid = Array(25).fill(itemA) as Grid
		expect(isFull(fullGrid)).toBe(true)
	})
})
