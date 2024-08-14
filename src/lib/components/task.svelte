<script lang="ts">
	import { cn } from '$lib/utils';

	export let id: string | null | undefined;
	export let description: string;
	let additionalClass: string | null | undefined = undefined;
	export { additionalClass as class };
</script>

<div
	{id}
	role="button"
	tabindex="0"
	aria-grabbed="true"
	aria-dropeffect="move"
	class={cn(
		'm-3 inline-block h-32 w-28 border bg-yellow-200 p-2 text-center shadow-md dark:bg-amber-700 dark:shadow-yellow-500/50',
		additionalClass
	)}
	on:dragstart|nonpassive
	on:mousedown|nonpassive
	on:mousemove|nonpassive
	on:mouseup|nonpassive
	on:contextmenu|nonpassive
	on:touchmove|nonpassive
	on:touchend|nonpassive
	on:touchstart|nonpassive
	on:touchcancel|nonpassive
>
	{description}
</div>
