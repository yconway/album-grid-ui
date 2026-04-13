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
	let slotBaseClass = $derived(
		`aspect-square rounded-[--radius-thumb]${isShadow ? " ring-2 ring-accent" : ""}`,
	)

	function markImageErrored() {
		hasImageError = true
	}

	function removeSlot() {
		gridStore.removeItem(index)
	}

	function suppressContextMenu(event: Event) {
		event.preventDefault()
	}
</script>

{#if hasImageError}
	<div class="{slotBaseClass} bg-surface/60"></div>
{:else}
	<div
		class="{slotBaseClass} group relative cursor-grab overflow-hidden shadow-sm"
	>
		<img
			src={item.coverUrl}
			alt={item.title}
			loading="lazy"
			class="h-full w-full object-cover"
			onerror={markImageErrored}
			oncontextmenu={suppressContextMenu}
		/>
		<div
			class="absolute inset-0 bg-overlay opacity-0 transition-opacity duration-150 group-hover:opacity-100"
		></div>
		<button
			type="button"
			aria-label="Remove item"
			class="absolute right-1 top-1 cursor-pointer opacity-0 transition-opacity duration-150 group-hover:opacity-100 pointer-coarse:hidden"
			onclick={removeSlot}
		>
			<Trash2
				size={18}
				class="text-error"
			/>
		</button>
	</div>
{/if}
