<script lang="ts">
	import { cn } from '$lib/utils';

	export let description: string;
	export let selected: boolean | null | undefined = false;
	let additionalClass: string | null | undefined = undefined;
	export { additionalClass as class };
</script>

<div
	class={cn(
		'm-3 inline-block h-32 w-28 border bg-yellow-200 p-2 text-center shadow-md dark:bg-amber-700 dark:shadow-yellow-500/50',
		selected && 'border-blue-600 bg-blue-200 opacity-75 shadow-lg  dark:shadow-yellow-700/50',
		additionalClass
	)}
>
	{description}
</div>
