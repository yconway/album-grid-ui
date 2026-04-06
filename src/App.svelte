<script lang="ts">
	import ThemeToggle from "./lib/ThemeToggle.svelte"
</script>

<div class="relative min-h-screen">
	<header class="absolute top-4 right-4">
		<ThemeToggle />
	</header>

	<main
		class="flex min-h-screen flex-col items-center justify-center gap-4 p-8"
	>
		<h1 class="text-3xl font-bold tracking-tight">Album Grid</h1>
	</main>
</div>
