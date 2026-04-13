import { describe, expect, it } from "vitest"
import {
	addItem,
	isFull,
	removeItem,
	stripShadowItems,
	GRID_SIZE,
} from "./grid.util"
import type { DndFilledItem, Grid, MediaItem } from "./grid.type"

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

describe("stripShadowItems", () => {
	const shadow: DndFilledItem = {
		...makeItem("shadow"),
		isDndShadowItem: true,
	}

	it("returns an empty grid for empty input", () => {
		expect(stripShadowItems([])).toEqual([])
	})

	it("returns the same items when no shadow item is present", () => {
		expect(stripShadowItems([itemA, itemB, itemC])).toEqual([
			itemA,
			itemB,
			itemC,
		])
	})

	it("removes a single shadow item, preserving order of real items", () => {
		expect(stripShadowItems([itemA, shadow, itemB, itemC])).toEqual([
			itemA,
			itemB,
			itemC,
		])
	})

	it("handles a shadow item at the start", () => {
		expect(stripShadowItems([shadow, itemA, itemB])).toEqual([itemA, itemB])
	})

	it("handles a shadow item in the middle", () => {
		expect(stripShadowItems([itemA, shadow, itemB])).toEqual([itemA, itemB])
	})

	it("handles a shadow item at the end", () => {
		expect(stripShadowItems([itemA, itemB, shadow])).toEqual([itemA, itemB])
	})

	it("does not mutate the input", () => {
		const input: DndFilledItem[] = [itemA, shadow, itemB]
		const snapshot = [...input]
		stripShadowItems(input)
		expect(input).toEqual(snapshot)
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
