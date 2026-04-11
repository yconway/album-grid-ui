<script lang="ts">
	import { gridStore } from "../../stores/grid.svelte"
	import {
		emptyGrid,
		oneItemGrid,
		partialGrid,
		nearFullGrid,
		fullGrid,
	} from "../../lib/gridPresets"

	let isOpen = $state(false)
	let wrapperEl: HTMLElement | undefined

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

	function loadPreset(preset: typeof emptyGrid) {
		gridStore.loadGrid(preset)
		isOpen = false
	}

	$effect(() => {
		if (!isOpen) return
		function handleOutsideClick(event: MouseEvent) {
			if (!wrapperEl?.contains(event.target as Node)) {
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
		bind:this={wrapperEl}
	>
		<button
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
