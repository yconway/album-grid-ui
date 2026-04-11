<script lang="ts">
	import { Plus, Trash2 } from "lucide-svelte"
	import type { GridSlot } from "../../stores/grid.type"
	import { gridStore } from "../../stores/grid.svelte"

	interface MediaSlotProps {
		slot: GridSlot
		index: number
	}

	let { slot, index }: MediaSlotProps = $props()

	let hasImageError = $state(false)

	function markImageErrored() {
		hasImageError = true
	}

	function removeSlot() {
		gridStore.removeItem(index)
		gridStore.vacuumGrid()
	}

	$effect(() => {
		slot?.coverUrl
		hasImageError = false
	})
</script>

{#if slot === null}
	<div
		class="group flex aspect-square cursor-pointer items-center justify-center rounded-[--radius-thumb] border border-dashed border-border bg-surface transition-colors hover:border-accent"
	>
		<Plus
			size={24}
			class="opacity-40 text-text-secondary transition-transform group-hover:scale-110"
		/>
	</div>
{:else if hasImageError}
	<div class="aspect-square rounded-[--radius-thumb] bg-surface/60"></div>
{:else}
	<div class="group relative aspect-square overflow-hidden rounded-[--radius-thumb] shadow-sm">
		<img
			src={slot.coverUrl}
			alt={slot.title}
			loading="lazy"
			class="h-full w-full object-cover"
			onerror={markImageErrored}
		/>
		<div
			class="absolute inset-0 bg-(--color-overlay) opacity-0 transition-opacity duration-150 group-hover:opacity-100"
		></div>
		<button
			class="absolute right-1 top-1 cursor-pointer opacity-0 transition-opacity duration-150 group-hover:opacity-100"
			onclick={removeSlot}
		>
			<Trash2
				size={18}
				class="text-(--color-error)"
			/>
		</button>
	</div>
{/if}
