<script lang="ts">
	import { Plus } from "lucide-svelte"
	import type { GridSlot } from "../../stores/grid.type"

	interface MediaSlotProps {
		slot: GridSlot
	}

	let { slot }: MediaSlotProps = $props()

	let hasImageError = $state(false)

	function markImageErrored() {
		hasImageError = true
	}

	$effect(() => {
		slot?.coverUrl
		hasImageError = false
	})
</script>

{#if slot === null}
	<div
		class="flex aspect-square cursor-pointer items-center justify-center rounded-[--radius-thumb] border border-dashed border-border bg-surface"
	>
		<Plus
			size={24}
			class="opacity-40 text-text-secondary"
		/>
	</div>
{:else if hasImageError}
	<div class="aspect-square rounded-[--radius-thumb] bg-surface/60"></div>
{:else}
	<div class="aspect-square overflow-hidden rounded-[--radius-thumb] shadow-sm">
		<img
			src={slot.coverUrl}
			alt={slot.title}
			loading="lazy"
			class="h-full w-full object-cover"
			onerror={markImageErrored}
		/>
	</div>
{/if}
