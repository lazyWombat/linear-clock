<script lang="ts">
	import Clock from '$lib/components/clock.svelte';

	export const prerender = true;
	export const csr = false;
</script>

<div class="w-full justify-center px-20 py-10">
	<Clock />
	<script>
		setTimeout(function () {
			location.reload();
		}, 30000);
	</script>
</div>
