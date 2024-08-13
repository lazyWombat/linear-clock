<script lang="ts">
	import timer from '$lib/timer';
	import { cn } from '$lib/utils';
	let clock = timer({ interval: 1000 });

	type Segment = {
		length: number;
		cellWidth: number;
		isEmpty?: boolean;
	};

	const segments: Segment[] = [
		{ length: 1, cellWidth: 1, isEmpty: true },
		{ length: 12, cellWidth: 1 },
		{ length: 30, cellWidth: 2 },
		{ length: 6, cellWidth: 1 },
		{ length: 1, cellWidth: 1, isEmpty: true }
	];

	const segmentsWithOffset = segments.map(
		((acc) => (s) => {
			const so = { ...s, offset: acc };
			acc += s.length;
			return so;
		})(0)
	);

	const columnTemplate = segments
		.map((s) =>
			s.length == 1 ? `${s.cellWidth}fr` : `repeat(${s.length}, ${s.cellWidth}fr [col-start])`
		)
		.join(' ');

	function getSegment(x: number, cellNumber: number): Segment {
		return (
			segmentsWithOffset.find((s) => cellNumber >= s.offset && cellNumber < s.offset + s.length) ||
			segmentsWithOffset[segmentsWithOffset.length - 1]
		);
	}
	function getTwoSegments(x: number, cellNumber: number): { prev: Segment; curr: Segment } {
		return {
			prev: getSegment(x, cellNumber - 1),

			curr: getSegment(x, cellNumber)
		};
	}

	const cells = [...Array(24 * 2 + 2).keys()];
	// find completed ticks
	$: time = $clock;
	$: completed = time.getHours() * 2 + time.getMinutes() / 30;
	$: current = Math.floor(completed);
	$: currentWidth = completed - current;
	const coef = 6;
</script>

<div class="m-10 mx-auto">
	<h1 class="text-center font-clockFont text-8xl tracking-tight">
		<span>{time.toLocaleTimeString([], { timeStyle: 'short' })}</span>
	</h1>
</div>

<div
	class="grid items-end justify-center justify-items-center gap-1"
	style="grid-template-columns: {columnTemplate}"
>
	{#each cells.map(getSegment) as segment, i}
		{#if !!segment.isEmpty}
			<div />
		{:else if i + 1 > current}
			<div
				class="h-full min-h-24 w-full"
				style="background-image:linear-gradient(to right,
					hsl({i * coef}, 100%, 50%), hsl({(i + 1) * coef}, 100%, 50%))"
			></div>
		{:else if i + 1 === current}
			<div class="flex h-full w-full flex-row border border-black">
				<div
					class="h-[50%] self-end"
					style="width: {currentWidth * 100}%; background-color:hsl({i * coef}, 20%, 20%)"
				></div>
				<div
					class="h-full"
					style="width: {(1 - currentWidth) * 100}%; background-color:hsl({i * coef}, 100%, 50%)"
				></div>
			</div>
		{:else}
			<div
				class="h-[50%] w-full"
				style="background-image:linear-gradient(to right,
					hsl({i * coef}, 20%, 20%), hsl({(i + 1) * coef}, 20%, 20%))"
			></div>
		{/if}
	{/each}
	{#each cells.map(getTwoSegments) as pair, i}
		{#if i > 0}
			{#if pair.prev.cellWidth < pair.curr.cellWidth}
				<span
					class={cn(
						'col-span-2 row-start-2 self-baseline',
						i % 2 !== 0 && 'text-2xl font-semibold',
						i % 2 === 0 && 'text-sm'
					)}
					style="grid-column-start: {i}; padding-right: {100 -
						200 / (pair.prev.cellWidth + pair.curr.cellWidth)}%">|</span
				>
			{:else if pair.prev.cellWidth > pair.curr.cellWidth}
				<span
					class={cn(
						'col-span-2 row-start-2 self-baseline',
						i % 2 !== 0 && 'text-2xl font-semibold',
						i % 2 === 0 && 'text-sm'
					)}
					style="grid-column-start: {i}; padding-left: {100 -
						200 / (pair.prev.cellWidth + pair.curr.cellWidth)}%">|</span
				>
			{:else}
				<span
					class={cn(
						'col-span-2 row-start-2 self-baseline',
						i % 2 !== 0 && 'text-2xl font-semibold',
						i % 2 === 0 && 'text-sm'
					)}
					style="grid-column-start: {i};">|</span
				>
			{/if}
		{/if}
	{/each}
	{#each cells.map(getTwoSegments) as pair, i}
		{#if i % 2 !== 0}
			{#if pair.prev.cellWidth < pair.curr.cellWidth}
				<span
					class="col-span-2 row-start-3 font-clockFont text-xl font-semibold -tracking-widest"
					style="grid-column-start: {i}; padding-right: {100 -
						200 / (pair.prev.cellWidth + pair.curr.cellWidth)}%">{(i - 1) / 2}</span
				>
			{:else if pair.prev.cellWidth > pair.curr.cellWidth}
				<span
					class="col-span-2 row-start-3 font-clockFont text-xl font-semibold -tracking-widest"
					style="grid-column-start: {i}; padding-left: {100 -
						200 / (pair.prev.cellWidth + pair.curr.cellWidth)}%">{(i - 1) / 2}</span
				>
			{:else}
				<span
					class="col-span-2 row-start-3 font-clockFont text-xl font-semibold -tracking-widest"
					style="grid-column-start: {i};">{(i - 1) / 2}</span
				>
			{/if}
		{:else}
			<span />
		{/if}
	{/each}
	<!-- {#each ticks as tick}
		{#if tick}
			<span class="font-clockFont text-2xl font-semibold tracking-tighter">{tick}</span>
		{:else}
			<span>&nbsp;</span>
		{/if}
	{/each}
	{#each ticks as tick}
		{#if tick}
			<span class="font-semibold">|</span>
		{:else}
			<span class="text-sm">|</span>
		{/if}
	{/each}
	{#each ticks as _, i}
		<div class="flex h-[100px] w-full flex-row justify-items-end">
			{#if i == 0}
				<div class="w-[50%]" />
			{:else if completed >= i}
				<div
					class="h-full w-[50%]"
					style="background-image:linear-gradient(to right, 
                            hsl({i * coef}, 100%, 50%), 
                            hsl({(i + 0.5) * coef}, 100%, 50%))"
				></div>
			{:else if i === current && side === 'l'}
				<div
					class="h-full border"
					style="width:{currentWidth}%; background-color:hsl({i * coef}, 100%, 30%)"
				></div>
			{:else}
				<div />
			{/if}
			{#if completed >= i + 0.5}
				<div
					class="h-full w-[50%]"
					style="background-image:linear-gradient(to right, 
                            hsl({(i + 0.5) * coef}, 100%, 50%), 
                            hsl({(i + 1) * coef}, 100%, 50%))"
				></div>
			{:else if i === current && side === 'r'}
				<div
					class="h-full border"
					style="width:{currentWidth}%; background-color:hsl({i * coef}, 100%, 30%)"
				></div>
			{:else}
				<div />
			{/if}
		</div>
	{/each}
	{#each ticks as _, i}
		{#if i == current && side == 'r'}
			<span class="font-sans text-xl font-bold" style="padding-left:{currentWidth * 2}%">⇧</span>
		{:else if i == current && side == 'l'}
			<span class="font-sans text-xl font-bold" style="padding-right:{100 - currentWidth * 2}%"
				>⇧</span
			>
		{:else}
			<span />
		{/if}
	{/each} -->
</div>
