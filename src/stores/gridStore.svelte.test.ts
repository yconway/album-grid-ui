import { beforeEach, describe, expect, it } from "vitest"
import { createGridStore } from "./gridStore.svelte"
import { GRID_SIZE } from "./grid.util"
import type { Grid, GridStore, MediaItem } from "./grid.type"

function makeItem(id: string): MediaItem {
	return {
		id,
		title: `Title ${id}`,
		subtitle: `Subtitle ${id}`,
		coverUrl: `https://example.com/${id}.jpg`,
	}
}

const firstItem = makeItem("first")
const secondItem = makeItem("second")

describe("gridStore", () => {
	let store: GridStore

	beforeEach(() => {
		store = createGridStore()
	})

	it("initializes with no items", () => {
		expect(store.slots).toEqual([])
	})

	it("isFull is false on an empty store", () => {
		expect(store.isFull).toBe(false)
	})

	it("addItem appends to slots", () => {
		store.addItem(firstItem)
		expect(store.slots).toEqual([firstItem])
	})

	it("loadGrid replaces slots with the provided grid", () => {
		store.addItem(firstItem)
		store.addItem(secondItem)

		const newGrid: Grid = [makeItem("replacement")]
		store.loadGrid(newGrid)

		expect(store.slots).toEqual(newGrid)
	})

	it("removeItem removes the slot at the given index", () => {
		store.addItem(firstItem)
		store.addItem(secondItem)
		store.removeItem(0)
		expect(store.slots).toEqual([secondItem])
	})

	it("isFull is true when all slots are occupied", () => {
		for (let slotIndex = 0; slotIndex < GRID_SIZE; slotIndex++) {
			store.addItem(makeItem(String(slotIndex)))
		}
		expect(store.isFull).toBe(true)
	})

	it("isFull reflects state after loadGrid", () => {
		const fullGrid: Grid = Array.from(
			{ length: GRID_SIZE },
			(_unusedSlot, slotIndex) => makeItem(String(slotIndex)),
		)
		store.loadGrid(fullGrid)
		expect(store.isFull).toBe(true)
	})

	describe("error propagation", () => {
		it("addItem throws on a full grid and does not corrupt state", () => {
			for (let slotIndex = 0; slotIndex < GRID_SIZE; slotIndex++) {
				store.addItem(makeItem(String(slotIndex)))
			}
			const slotsBefore = [...store.slots]
			expect(() => store.addItem(makeItem("overflow"))).toThrow(Error)
			expect(store.slots).toEqual(slotsBefore)
		})

		it("removeItem throws on an out-of-bounds index and does not corrupt state", () => {
			store.addItem(firstItem)
			const slotsBefore = [...store.slots]
			expect(() => store.removeItem(-1)).toThrow(RangeError)
			expect(() => store.removeItem(1)).toThrow(RangeError)
			expect(store.slots).toEqual(slotsBefore)
		})
	})
})
