<script lang="ts">
	import Clock from '$lib/components/clock.svelte';
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
	$: currentWidth = side == 'r' ? (completed - current) * 100 : (1 + completed - current) * 100;
	const coef = 6;
</script>

<div class="w-full px-20 py-10">
	<Clock />
</div>
