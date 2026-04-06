<script lang="ts">
	import { Sun, Moon } from "lucide-svelte"

	type StoredPreference = "dark" | "light" | "system"

	const STORAGE_KEY = "theme"

	let preference = $state<StoredPreference>(loadPreference())

	let activeTheme = $derived<"dark" | "light">(
		preference === "system" ? resolveSystemTheme() : preference,
	)

	$effect(() => {
		document.documentElement.classList.remove("dark", "light")
		if (preference !== "system") {
			document.documentElement.classList.add(preference)
		}
		localStorage.setItem(STORAGE_KEY, preference)
	})

	function toggle() {
		preference = activeTheme === "dark" ? "light" : "dark"
	}

	function loadPreference(): StoredPreference {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (saved === "dark" || saved === "light" || saved === "system")
			return saved
		return "system"
	}

	function resolveSystemTheme(): "dark" | "light" {
		return window.matchMedia("(prefers-color-scheme: light)").matches ?
				"light"
			:	"dark"
	}
</script>

<button
	onclick={toggle}
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
