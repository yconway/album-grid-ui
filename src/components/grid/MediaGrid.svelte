<script lang="ts">
	import { flip } from "svelte/animate"
	import { fade } from "svelte/transition"
	import { dndzone } from "svelte-dnd-action"
	import type { DndEvent } from "svelte-dnd-action"
	import { gridStore } from "../../stores/gridStore.svelte"
	import { GRID_SIZE, GRID_WIDTH } from "../../stores/grid.util"
	import type { MediaItem } from "../../stores/grid.type"
	import EmptySlot from "./EmptySlot.svelte"
	import FilledSlot from "./FilledSlot.svelte"
	import TrashZone from "./TrashZone.svelte"
	import { bigTick, smallTick } from "../../lib/haptics"

	const FLIP_DURATION_MS = 200

	// During a drag, svelte-dnd-action injects a shadow placeholder into the
	// items array. It has the same shape as a real item plus a marker flag.
	type DndFilledItem = MediaItem & { isDndShadowItem?: boolean }

	/** during drag, this holds the tentative state of filled items including the shadow item */
	let tentativeSlots = $state<DndFilledItem[] | null>(null)
	let filledSlotsToShow = $derived<DndFilledItem[]>(
		tentativeSlots ?? gridStore.slots,
	)
	let isDragging = $derived(tentativeSlots !== null)

	let isMobile = $state(false)

	// track mobile mode
	$effect(() => {
		const query = window.matchMedia("(pointer: coarse)")
		isMobile = query.matches
		function handleChange(event: MediaQueryListEvent) {
			isMobile = event.matches
		}
		query.addEventListener("change", handleChange)
		return () => query.removeEventListener("change", handleChange)
	})

	/** implementation for svelte-dnd - called when drag is hovering over slots*/
	function handleConsider(event: CustomEvent<DndEvent<DndFilledItem>>) {
		if (tentativeSlots !== null) {
			smallTick()
		} else {
			bigTick()
		}
		tentativeSlots = event.detail.items
	}

	/** called by svelte-dnd when the user lets go of a dragged item */
	function handleFinalize(event: CustomEvent<DndEvent<DndFilledItem>>) {
		// If the drop landed in the TrashZone, the item left this zone during
		// consider — so event.detail.items is already the post-delete list and
		// loadGrid effectively removes it. Same code path handles reorder.
		const reordered = event.detail.items.filter(
			(item) => !item.isDndShadowItem,
		) as MediaItem[]
		gridStore.loadGrid(reordered)
		tentativeSlots = null
	}

	function isShadowItem(item: DndFilledItem): boolean {
		return item.isDndShadowItem === true
	}

	/** tilt the dragged clone; svelte-dnd-action uses transform on the
	 *  outer wrapper for positioning, so we rotate the inner card instead */
	function tiltDraggedElement(draggedEl?: HTMLElement) {
		const card = draggedEl?.firstElementChild
		if (card instanceof HTMLElement) {
			card.style.transform = "rotate(4deg)"
			card.style.transition = "transform 150ms ease-out"
		}
	}
</script>

<!-- md:w-150 (37.5rem) is approx. GRID_WIDTH * slot width — keep in sync with grid config -->
<div class="mx-auto w-full md:w-150">
	<!-- Two stacked grids: the empty layer defines the 5x5 footprint; the dnd
		 layer sits on top and only contains filled items, so svelte-dnd-action
		 never sees empty slots and the filled-prefix invariant is preserved
		 for free. -->
	<div class="relative">
		<div
			class="grid gap-(--spacing-grid-gap)"
			style="grid-template-columns: repeat({GRID_WIDTH}, minmax(0, 1fr))"
		>
			{#each Array.from({ length: GRID_SIZE }) as _, index}
				<EmptySlot isNext={index === gridStore.slots.length} />
			{/each}
		</div>
		<div
			class="absolute inset-0 grid content-start gap-(--spacing-grid-gap)"
			style="grid-template-columns: repeat({GRID_WIDTH}, minmax(0, 1fr))"
			use:dndzone={{
				items: filledSlotsToShow,
				flipDurationMs: FLIP_DURATION_MS,
				dropTargetStyle: {},
				delayTouchStart: 150,
				transformDraggedElement: tiltDraggedElement,
			}}
			onconsider={handleConsider}
			onfinalize={handleFinalize}
		>
			{#each filledSlotsToShow as item, index (item.id)}
				<div animate:flip={{ duration: FLIP_DURATION_MS }}>
					<FilledSlot
						{item}
						{index}
						isShadow={isShadowItem(item)}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
{#if isMobile && isDragging}
	<div
		class="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
		transition:fade={{ duration: 150 }}
	>
		<TrashZone />
	</div>
{/if}
