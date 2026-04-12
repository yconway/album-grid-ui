import { describe, expect, it } from "vitest"
import { addItem, isFull, removeItem, GRID_SIZE } from "./grid.util"
import type { Grid, MediaItem } from "./grid.type"

function makeItem(id: string): MediaItem {
	return {
		id,
		title: `Title ${id}`,
		subtitle: `Subtitle ${id}`,
		coverUrl: `https://example.com/${id}.jpg`,
	}
}

const itemA = makeItem("a")
const itemB = makeItem("b")
const itemC = makeItem("c")

describe("addItem", () => {
	it("appends to an empty grid", () => {
		const updated = addItem([], itemA)
		expect(updated).toEqual([itemA])
	})

	it("appends after existing items", () => {
		const updated = addItem([itemA, itemB], itemC)
		expect(updated).toEqual([itemA, itemB, itemC])
	})

	it("throws when the grid is full", () => {
		const fullGrid: Grid = Array.from({ length: GRID_SIZE }, () => itemA)
		expect(() => addItem(fullGrid, itemB)).toThrow(Error)
	})

	it("does not mutate the original grid", () => {
		const grid: Grid = [itemA]
		addItem(grid, itemB)
		expect(grid).toEqual([itemA])
	})
})

describe("removeItem", () => {
	it("removes the item at the given index", () => {
		const updated = removeItem([itemA, itemB, itemC], 1)
		expect(updated).toEqual([itemA, itemC])
	})

	it("shifts subsequent items left", () => {
		const updated = removeItem([itemA, itemB, itemC], 0)
		expect(updated).toEqual([itemB, itemC])
	})

	it("does not mutate the original grid", () => {
		const grid: Grid = [itemA, itemB]
		removeItem(grid, 0)
		expect(grid).toEqual([itemA, itemB])
	})

	it("throws when index is past the end of the grid", () => {
		expect(() => removeItem([itemA], 1)).toThrow(RangeError)
	})

	it("throws when index is negative", () => {
		expect(() => removeItem([itemA], -1)).toThrow(RangeError)
	})

	it("throws when removing from an empty grid", () => {
		expect(() => removeItem([], 0)).toThrow(RangeError)
	})
})

describe("isFull", () => {
	it("returns false for an empty grid", () => {
		expect(isFull([])).toBe(false)
	})

	it("returns false when the grid has fewer than GRID_SIZE items", () => {
		const grid: Grid = Array.from(
			{ length: GRID_SIZE - 1 },
			(_unusedSlot, index) => makeItem(String(index)),
		)
		expect(isFull(grid)).toBe(false)
	})

	it("returns true when the grid has exactly GRID_SIZE items", () => {
		const grid: Grid = Array.from({ length: GRID_SIZE }, (_unusedSlot, index) =>
			makeItem(String(index)),
		)
		expect(isFull(grid)).toBe(true)
	})
})
