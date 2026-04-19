<script lang="ts">
	import { Plus } from "lucide-svelte"

	interface Props {
		isNext?: boolean
	}

	let { isNext = false }: Props = $props()
</script>

{#if isNext}
	<div
		class="group flex aspect-square cursor-pointer items-center justify-center rounded-[--radius-thumb] border border-dashed border-border bg-surface transition-colors hover:border-accent"
	>
		<Plus
			size={24}
			class="opacity-40 text-text-secondary transition-transform group-hover:scale-110"
		/>
	</div>
{:else}
	<div
		class="aspect-square rounded-[--radius-thumb] border border-dashed border-border bg-surface"
	></div>
{/if}
