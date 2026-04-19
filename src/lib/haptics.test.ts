import { afterEach, describe, expect, it, vi } from "vitest"
import { bigTick, smallTick } from "./haptics"

const originalNavigator = globalThis.navigator

afterEach(() => {
	vi.unstubAllGlobals()
	Object.defineProperty(globalThis, "navigator", {
		value: originalNavigator,
		configurable: true,
		writable: true,
	})
})

function stubNavigatorWithVibrate(
	vibrate: ((pattern: number | number[]) => boolean) | undefined,
): ReturnType<typeof vi.fn> | undefined {
	const vibrateMock = vibrate ? vi.fn(vibrate) : undefined
	vi.stubGlobal("navigator", { vibrate: vibrateMock })
	return vibrateMock
}

describe("bigTick", () => {
	it("calls navigator.vibrate(40) when available", () => {
		const vibrateMock = stubNavigatorWithVibrate(() => true)
		bigTick()
		expect(vibrateMock).toHaveBeenCalledWith(40)
	})

	it("does not throw when navigator.vibrate is undefined", () => {
		stubNavigatorWithVibrate(undefined)
		expect(() => bigTick()).not.toThrow()
	})
})

describe("smallTick", () => {
	it("calls navigator.vibrate(4) when available", () => {
		const vibrateMock = stubNavigatorWithVibrate(() => true)
		smallTick()
		expect(vibrateMock).toHaveBeenCalledWith(4)
	})

	it("does not throw when navigator.vibrate is undefined", () => {
		stubNavigatorWithVibrate(undefined)
		expect(() => smallTick()).not.toThrow()
	})
})
