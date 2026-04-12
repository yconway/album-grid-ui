<script lang="ts">
	import { Trash2 } from "lucide-svelte"
	import type { MediaItem } from "../../stores/grid.type"
	import { gridStore } from "../../stores/gridStore.svelte"

	interface FilledSlotProps {
		item: MediaItem
		index: number
		isShadow?: boolean
	}

	let { item, index, isShadow = false }: FilledSlotProps = $props()

	let hasImageError = $state(false)

	function markImageErrored() {
		hasImageError = true
	}

	function removeSlot() {
		gridStore.removeItem(index)
	}
</script>

{#if hasImageError}
	<div
		class="aspect-square rounded-[--radius-thumb] bg-surface/60 {isShadow ?
			'ring-2 ring-accent'
		:	''}"
	></div>
{:else}
	<div
		class="group relative aspect-square cursor-grab overflow-hidden rounded-[--radius-thumb] shadow-sm {(
			isShadow
		) ?
			'ring-2 ring-accent'
		:	''}"
	>
		<img
			src={item.coverUrl}
			alt={item.title}
			loading="lazy"
			class="h-full w-full object-cover"
			onerror={markImageErrored}
		/>
		<div
			class="absolute inset-0 bg-overlay opacity-0 transition-opacity duration-150 group-hover:opacity-100"
		></div>
		<button
			type="button"
			aria-label="Remove item"
			class="absolute right-1 top-1 cursor-pointer opacity-0 transition-opacity duration-150 group-hover:opacity-100"
			onclick={removeSlot}
		>
			<Trash2
				size={18}
				class="text-error"
			/>
		</button>
	</div>
{/if}
