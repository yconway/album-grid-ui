<script lang="ts">
	import { Sun, Moon } from "lucide-svelte"
	import {
		LIGHT_MEDIA_QUERY,
		STORAGE_KEY,
		loadPreference,
		nextTheme,
		resolveActiveTheme,
	} from "./ThemeToggle"
	import type { StoredPreference, Theme } from "./ThemeToggle"

	let preference = $state<StoredPreference>(loadPreference())

	//its ok if the user changes their system theme while the app is open.  It's not worth worrying about.
	const systemTheme: Theme =
		window.matchMedia(LIGHT_MEDIA_QUERY).matches ? "light" : "dark"
	let activeTheme = $derived(resolveActiveTheme(preference, systemTheme))

	// Sync preference to the DOM class and localStorage whenever it changes
	$effect(() => {
		document.documentElement.classList.remove("dark", "light")
		if (preference !== "system") {
			document.documentElement.classList.add(preference)
		}
		localStorage.setItem(STORAGE_KEY, preference)
	})

	function toggleLightDarkMode() {
		preference = nextTheme(activeTheme)
	}
</script>

<button
	onclick={toggleLightDarkMode}
	aria-label={activeTheme === "dark" ?
		"Switch to light mode"
	:	"Switch to dark mode"}
	class="rounded-md p-2 bg-text-primary text-surface hover:opacity-90"
>
	{#if activeTheme === "dark"}
		<Sun size={18} />
	{:else}
		<Moon size={18} />
	{/if}
</button>
