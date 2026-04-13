<script lang="ts">
	import { flip } from "svelte/animate"
	import { fade } from "svelte/transition"
	import { dndzone } from "svelte-dnd-action"
	import type { DndEvent } from "svelte-dnd-action"
	import { gridStore } from "../../stores/gridStore.svelte"
	import {
		GRID_SIZE,
		GRID_WIDTH,
		stripShadowItems,
	} from "../../stores/grid.util"
	import type { DndFilledItem } from "../../stores/grid.type"
	import EmptySlot from "./EmptySlot.svelte"
	import FilledSlot from "./FilledSlot.svelte"
	import TrashZone from "./TrashZone.svelte"
	import { bigTick, smallTick } from "../../lib/haptics"

	const FLIP_DURATION_MS = 200
	const DRAG_TOUCH_DELAY_MS = 150
	const DRAG_TILT_DEG = 4
	const DRAG_TILT_TRANSITION_MS = 150
	/** Slot edge length at the md breakpoint. The grid's max-width is derived
	 *  from this so GRID_WIDTH changes stay in sync automatically. */
	const SLOT_SIZE_MD = "6.9rem"

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
		// stripShadowItems yields the post-delete grid. Same code path handles reorder.
		gridStore.loadGrid(stripShadowItems(event.detail.items))
		tentativeSlots = null
	}

	/** tilt the dragged clone; svelte-dnd-action uses transform on the
	 *  outer wrapper for positioning, so we rotate the inner card instead */
	function tiltDraggedElement(draggedEl?: HTMLElement) {
		const card = draggedEl?.firstElementChild
		if (card instanceof HTMLElement) {
			card.style.transform = `rotate(${DRAG_TILT_DEG}deg)`
			card.style.transition = `transform ${DRAG_TILT_TRANSITION_MS}ms ease-out`
		}
	}
</script>

<!-- Max grid width on md+ is derived from GRID_WIDTH and the gap token,
	 so changing either stays in sync without manual retuning. -->
<div
	class="mx-auto w-full md:max-w-(--grid-max-width)"
	style="--grid-max-width: calc({GRID_WIDTH} * {SLOT_SIZE_MD} + ({GRID_WIDTH} - 1) * var(--spacing-grid-gap))"
>
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
				delayTouchStart: DRAG_TOUCH_DELAY_MS,
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
						isShadow={item.isDndShadowItem === true}
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
