import { describe, expect, it } from "vitest"
import {
	STORAGE_KEY,
	loadPreference,
	nextTheme,
	resolveActiveTheme,
} from "./ThemeToggle"

function makeStorage(
	initial: Record<string, string> = {},
): Pick<Storage, "getItem"> {
	const data = { ...initial }
	return { getItem: (key: string) => data[key] ?? null }
}

describe("loadPreference", () => {
	it("returns 'system' when nothing is stored", () => {
		expect(loadPreference(makeStorage())).toBe("system")
	})

	it("returns 'dark' when 'dark' is stored", () => {
		expect(loadPreference(makeStorage({ [STORAGE_KEY]: "dark" }))).toBe("dark")
	})

	it("returns 'light' when 'light' is stored", () => {
		expect(loadPreference(makeStorage({ [STORAGE_KEY]: "light" }))).toBe(
			"light",
		)
	})

	it("returns 'system' when 'system' is stored", () => {
		expect(loadPreference(makeStorage({ [STORAGE_KEY]: "system" }))).toBe(
			"system",
		)
	})

	it("returns 'system' for an unrecognized stored value", () => {
		expect(loadPreference(makeStorage({ [STORAGE_KEY]: "auto" }))).toBe(
			"system",
		)
	})
})

describe("resolveActiveTheme", () => {
	it("returns systemTheme when preference is 'system'", () => {
		expect(resolveActiveTheme("system", "dark")).toBe("dark")
		expect(resolveActiveTheme("system", "light")).toBe("light")
	})

	it("returns 'dark' when preference is 'dark', regardless of system theme", () => {
		expect(resolveActiveTheme("dark", "light")).toBe("dark")
	})

	it("returns 'light' when preference is 'light', regardless of system theme", () => {
		expect(resolveActiveTheme("light", "dark")).toBe("light")
	})
})

describe("nextTheme", () => {
	it("toggles dark to light", () => {
		expect(nextTheme("dark")).toBe("light")
	})

	it("toggles light to dark", () => {
		expect(nextTheme("light")).toBe("dark")
	})
})
