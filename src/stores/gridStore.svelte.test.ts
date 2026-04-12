import { beforeEach, describe, expect, it } from "vitest"
import { createGridStore } from "./gridStore.svelte"
import type { Grid, GridSlot, GridStore, MediaItem } from "./grid.type"

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

	it("initializes with 25 empty slots", () => {
		expect(store.slots).toHaveLength(25)
		expect(store.slots.every((slot) => slot === null)).toBe(true)
	})

	it("isFull is false on an empty store", () => {
		expect(store.isFull).toBe(false)
	})

	it("addItem updates slots", () => {
		store.addItem(firstItem)
		expect(store.slots[0]).toBe(firstItem)
	})

	it("loadGrid replaces all slots with the provided grid", () => {
		store.addItem(firstItem)
		store.addItem(secondItem)

		const newGrid: Grid = Array<GridSlot>(25).fill(null)
		newGrid[0] = makeItem("replacement")
		store.loadGrid(newGrid)

		expect(store.slots).toEqual(newGrid)
		expect(store.slots[0]).toEqual(makeItem("replacement"))
		expect(store.slots[1]).toBeNull()
	})

	it("removeItem removes the slot", () => {
		store.addItem(firstItem)
		store.removeItem(0)
		expect(store.slots[0]).toBeNull()
	})

	it("removeItem compacts the grid", () => {
		store.addItem(firstItem)
		store.addItem(secondItem)
		store.removeItem(0)
		expect(store.slots[0]).toBe(secondItem)
		expect(store.slots[1]).toBeNull()
	})

	it("swapSlots updates slots", () => {
		store.addItem(firstItem)
		store.addItem(secondItem)
		store.swapSlots(0, 1)
		expect(store.slots[0]).toBe(secondItem)
		expect(store.slots[1]).toBe(firstItem)
	})

	it("reorderSlot updates slots", () => {
		store.addItem(firstItem)
		store.addItem(secondItem)
		store.reorderSlot(0, 1)
		expect(store.slots[0]).toBe(secondItem)
		expect(store.slots[1]).toBe(firstItem)
	})

	it("isFull is true when all slots are occupied", () => {
		for (let slotIndex = 0; slotIndex < 25; slotIndex++) {
			store.addItem(makeItem(String(slotIndex)))
		}
		expect(store.isFull).toBe(true)
	})

	it("isFull reflects state after loadGrid", () => {
		const fullGrid: Grid = Array.from(
			{ length: 25 },
			(_unusedSlot, slotIndex) => makeItem(String(slotIndex)),
		)
		store.loadGrid(fullGrid)
		expect(store.isFull).toBe(true)
	})

	describe("edge cases", () => {
		it("reorderSlot with same from and to index returns unchanged grid", () => {
			store.addItem(firstItem)
			const slotsBefore = [...store.slots]
			store.reorderSlot(0, 0)
			expect(store.slots).toEqual(slotsBefore)
		})

		it("swapSlots with same index is a no-op", () => {
			store.addItem(firstItem)
			const slotsBefore = [...store.slots]
			store.swapSlots(0, 0)
			expect(store.slots).toEqual(slotsBefore)
		})
	})

	describe("error propagation", () => {
		it("addItem throws on a full grid and does not corrupt state", () => {
			for (let slotIndex = 0; slotIndex < 25; slotIndex++) {
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
			expect(() => store.removeItem(25)).toThrow(RangeError)
			expect(store.slots).toEqual(slotsBefore)
		})

		it("swapSlots throws on out-of-bounds indices and does not corrupt state", () => {
			store.addItem(firstItem)
			store.addItem(secondItem)
			const slotsBefore = [...store.slots]
			expect(() => store.swapSlots(-1, 0)).toThrow(RangeError)
			expect(() => store.swapSlots(0, 25)).toThrow(RangeError)
			expect(store.slots).toEqual(slotsBefore)
		})

		it("reorderSlot throws on out-of-bounds indices and does not corrupt state", () => {
			store.addItem(firstItem)
			store.addItem(secondItem)
			const slotsBefore = [...store.slots]
			expect(() => store.reorderSlot(-1, 0)).toThrow(RangeError)
			expect(() => store.reorderSlot(0, 25)).toThrow(RangeError)
			expect(store.slots).toEqual(slotsBefore)
		})
	})
})
