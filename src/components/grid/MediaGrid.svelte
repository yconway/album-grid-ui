<script lang="ts">
	import { gridStore } from "../../stores/grid.svelte"
	import { GRID_WIDTH } from "../../stores/grid"
	import MediaSlot from "./MediaSlot.svelte"
</script>

<!-- md:w-150 (37.5rem) is approx. GRID_WIDTH * slot width — keep in sync with grid config -->
<div class="mx-auto w-full md:w-150">
	<div
		class="grid gap-(--spacing-grid-gap)"
		style="grid-template-columns: repeat({GRID_WIDTH}, minmax(0, 1fr))"
	>
		{#each gridStore.slots as slot, index (slot?.id ?? `empty-${index}`)}
			<MediaSlot {slot} />
		{/each}
	</div>
</div>
