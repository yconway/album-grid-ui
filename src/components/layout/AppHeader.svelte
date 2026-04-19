<script lang="ts">
	import DevToolbar from "../dev/DevToolbar.svelte"
	import ThemeToggle from "../ui/ThemeToggle.svelte"
</script>

<header
	class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:px-8"
>
	<span class="text-lg font-bold tracking-tight text-text-primary"
		>Album Grid</span
	>
	<ThemeToggle />
	<DevToolbar />
</header>
