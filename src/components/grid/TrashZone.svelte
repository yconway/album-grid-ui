<script lang="ts">
	import { Trash2 } from "lucide-svelte"
	import { dndzone } from "svelte-dnd-action"
	import type { DndEvent } from "svelte-dnd-action"
	import type { MediaItem } from "../../stores/grid.type"
	import { bigTick } from "../../lib/haptics"

	// svelte-dnd-action requires every zone to keep its items array in sync
	// with the drag lifecycle. The trash zone accepts items transiently into
	// local state, then discards them on finalize. The actual removal from
	// gridStore happens in MediaGrid's finalize, which receives the grid's
	// items-minus-dragged list and calls loadGrid().
	let heldItems = $state<MediaItem[]>([])
	let isHovering = $derived(heldItems.length > 0)

	function handleConsider(event: CustomEvent<DndEvent<MediaItem>>) {
		const wasEmpty = heldItems.length === 0
		heldItems = event.detail.items
		if (wasEmpty && heldItems.length > 0) {
			bigTick()
		}
	}

	function handleFinalize() {
		heldItems = []
	}
</script>

<div
	class="pointer-events-auto relative h-16 w-16 rounded-full bg-error text-white shadow-lg transition-transform duration-150 {(
		isHovering
	) ?
		'scale-125 ring-4 ring-white/40'
	:	''}"
	role="region"
	aria-label="Drop here to delete"
>
	<div
		class="pointer-events-none absolute inset-0 flex items-center justify-center"
	>
		<Trash2 size={24} />
	</div>
	<div
		class="absolute inset-0"
		use:dndzone={{
			items: heldItems,
			flipDurationMs: 0,
			dropTargetStyle: {},
			dropTargetClasses: [],
		}}
		onconsider={handleConsider}
		onfinalize={handleFinalize}
	>
		{#each heldItems as heldItem (heldItem.id)}
			<div
				class="sr-only"
				aria-hidden="true"
			>
				{heldItem.id}
			</div>
		{/each}
	</div>
</div>
