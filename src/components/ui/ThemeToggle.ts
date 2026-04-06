export type Theme = "dark" | "light"
export type StoredPreference = Theme | "system"

export const STORAGE_KEY = "theme"
export const LIGHT_MEDIA_QUERY = "(prefers-color-scheme: light)"

export function loadPreference(
	storage: Pick<Storage, "getItem"> = localStorage,
): StoredPreference {
	const saved = storage.getItem(STORAGE_KEY)
	if (saved === "dark" || saved === "light" || saved === "system") {
		return saved
	}
	// use system preference if user has never toggled.
	return "system"
}

export function resolveActiveTheme(
	preference: StoredPreference,
	systemTheme: Theme,
): Theme {
	return preference === "system" ? systemTheme : preference
}

export function nextTheme(activeTheme: Theme): Theme {
	return activeTheme === "dark" ? "light" : "dark"
}
