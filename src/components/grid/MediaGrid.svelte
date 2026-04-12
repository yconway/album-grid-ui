<script lang="ts">
	import { flip } from "svelte/animate"
	import { dndzone } from "svelte-dnd-action"
	import type { DndEvent } from "svelte-dnd-action"
	import { gridStore } from "../../stores/gridStore.svelte"
	import { GRID_SIZE, GRID_WIDTH } from "../../stores/grid.util"
	import type { MediaItem } from "../../stores/grid.type"
	import EmptySlot from "./EmptySlot.svelte"
	import FilledSlot from "./FilledSlot.svelte"

	const FLIP_DURATION_MS = 200

	// During a drag, svelte-dnd-action injects a shadow placeholder into the
	// items array. It has the same shape as a real item plus a marker flag.
	type DndFilledItem = MediaItem & { isDndShadowItem?: boolean }

	/** during drag, this holds the tentative state of filled items including the shadow item */
	let tentativeSlots = $state<DndFilledItem[] | null>(null)
	let filledSlotsToShow = $derived<DndFilledItem[]>(
		tentativeSlots ?? gridStore.slots,
	)

	let isMobile = $state(false)
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
		tentativeSlots = event.detail.items
	}

	/** called by svelte-dnd when the user lets go of a dragged item */
	function handleFinalize(event: CustomEvent<DndEvent<DndFilledItem>>) {
		const reordered = event.detail.items.filter(
			(item) => !item.isDndShadowItem,
		) as MediaItem[]
		gridStore.loadGrid(reordered)
		tentativeSlots = null
	}

	function isShadowItem(item: DndFilledItem): boolean {
		return item.isDndShadowItem === true
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
			class="pointer-events-none absolute inset-0 grid content-start gap-(--spacing-grid-gap)"
			style="grid-template-columns: repeat({GRID_WIDTH}, minmax(0, 1fr))"
			use:dndzone={{
				items: filledSlotsToShow,
				flipDurationMs: FLIP_DURATION_MS,
				dragDisabled: isMobile,
				dropTargetStyle: {},
			}}
			onconsider={handleConsider}
			onfinalize={handleFinalize}
		>
			{#each filledSlotsToShow as item, index (item.id)}
				<div
					class="pointer-events-auto"
					animate:flip={{ duration: FLIP_DURATION_MS }}
				>
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
