<script lang="ts">
	import type { PageData } from '../$types';
	import TaskForm from './task-form.svelte';

	export let data: PageData;
</script>

<div class="w-full justify-center px-20 py-10">
	<div class="m-10 mx-auto">
		<h1 class="text-center font-clockFont text-4xl tracking-tight">Tasks</h1>
		<TaskForm data={data.form} />
	</div>
</div>
