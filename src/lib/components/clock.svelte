<script lang="ts">
	import timer from '$lib/timer';
	let clock = timer({ interval: 1000 });

	const ticks: string[] = [];
	for (let n of [...Array(24).keys()]) {
		ticks.push(n.toString());
		ticks.push('');
	}
	ticks.push('24');

	// find completed ticks
	$: time = $clock;
	$: completed = time.getHours() * 2 + time.getMinutes() / 30;
	$: side = time.getMinutes() % 30 < 15 ? 'r' : 'l';
	$: current = side === 'r' ? Math.floor(completed) : Math.ceil(completed);
	$: currentWidth = side == 'r' ? (completed - current) * 100 : (0.5 + completed - current) * 100;
	const coef = 6;
</script>

<div class="grid-cols-clock grid justify-center justify-items-center">
	{#each ticks as tick}
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
	{/each}
</div>
<div class="m-10 mx-auto">
	<h1 class="font-clockFont text-center text-8xl tracking-tight">
		<span>{time.toLocaleTimeString([], { timeStyle: 'short' })}</span>
	</h1>
</div>
