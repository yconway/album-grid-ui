import { beforeEach, describe, expect, it } from "vitest"
import { createGridStore } from "./grid.svelte"
import type { GridStore, MediaItem } from "./grid.type"

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
		store.addItem(itemA)
		expect(store.slots[0]).toBe(itemA)
	})

	it("removeItem updates slots", () => {
		store.addItem(itemA)
		store.removeItem(0)
		expect(store.slots[0]).toBeNull()
	})

	it("vacuumGrid compacts slots", () => {
		store.addItem(itemA)
		store.addItem(itemB)
		store.removeItem(0)
		store.vacuumGrid()
		expect(store.slots[0]).toBe(itemB)
		expect(store.slots[1]).toBeNull()
	})

	it("swapSlots updates slots", () => {
		store.addItem(itemA)
		store.addItem(itemB)
		store.swapSlots(0, 1)
		expect(store.slots[0]).toBe(itemB)
		expect(store.slots[1]).toBe(itemA)
	})

	it("reorderSlot updates slots", () => {
		store.addItem(itemA)
		store.addItem(itemB)
		store.reorderSlot(0, 1)
		expect(store.slots[0]).toBe(itemB)
		expect(store.slots[1]).toBe(itemA)
	})

	it("isFull is true when all slots are occupied", () => {
		for (let slotIndex = 0; slotIndex < 25; slotIndex++) {
			store.addItem(makeItem(String(slotIndex)))
		}
		expect(store.isFull).toBe(true)
	})
})
