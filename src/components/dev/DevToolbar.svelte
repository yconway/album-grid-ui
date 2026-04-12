<script lang="ts">
	import { gridStore } from "../../stores/gridStore.svelte"
	import {
		emptyGrid,
		oneItemGrid,
		partialGrid,
		nearFullGrid,
		fullGrid,
	} from "../../lib/gridPresets"
	import type { Grid } from "../../stores/grid.type"

	let isOpen = $state(false)
	let wrapperElement = $state<HTMLElement | undefined>(undefined)

	const presets = [
		{ label: "Empty", grid: emptyGrid },
		{ label: "One", grid: oneItemGrid },
		{ label: "Partial", grid: partialGrid },
		{ label: "Near Full", grid: nearFullGrid },
		{ label: "Full", grid: fullGrid },
	]

	function toggleDropdown() {
		isOpen = !isOpen
	}

	function loadPreset(preset: Grid) {
		gridStore.loadGrid(preset)
		isOpen = false
	}

	$effect(() => {
		if (!isOpen) {
			return
		}
		// The listener is added after the current event loop tick, so the click
		// that opened the dropdown has already finished bubbling and won't
		// immediately re-trigger this handler.
		function handleOutsideClick(event: MouseEvent) {
			if (!wrapperElement?.contains(event.target as Node)) {
				isOpen = false
			}
		}
		document.addEventListener("click", handleOutsideClick)
		return () => document.removeEventListener("click", handleOutsideClick)
	})
</script>

{#if import.meta.env.DEV}
	<div
		class="relative"
		bind:this={wrapperElement}
	>
		<button
			type="button"
			class="cursor-pointer px-2 py-1 text-sm font-medium text-text-secondary hover:text-text-primary"
			onclick={toggleDropdown}
		>
			Dev ▾
		</button>
		{#if isOpen}
			<div
				class="absolute right-0 top-full z-50 rounded-[--radius-card] border border-border bg-surface shadow-md"
			>
				{#each presets as preset}
					<button
						type="button"
						class="w-full cursor-pointer px-3 py-2 text-left text-sm text-text-primary hover:bg-background"
						onclick={() => loadPreset(preset.grid)}
					>
						{preset.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
