<script lang="ts">
	import AppHeader from "./AppHeader.svelte"
	import type { Snippet } from "svelte"

	interface AppShellProps {
		children: Snippet
	}

	let { children }: AppShellProps = $props()
</script>

<div class="flex h-dvh flex-col bg-background text-text-primary overflow-hidden">
	<AppHeader />
	<main class="flex flex-1 flex-col items-center overflow-y-auto px-4 py-8 md:px-8">
		<div class="w-full max-w-3xl">
			{@render children()}
		</div>
	</main>
</div>
