<script lang="ts">
	import Clock from '$lib/components/clock.svelte';
	import { flip } from 'svelte/animate';
	import * as Resizable from '$lib/components/ui/resizable';

	let baskets = [
		{
			name: 'TODO',
			tasks: [
				{ id: 1, text: 'Mop a floor' },
				{ id: 2, text: 'Write my first post' },
				{ id: 3, text: 'Upload the post to the blog' },
				{ id: 4, text: 'Publish the post at Facebook' },
				{ id: 5, text: 'Check X (formerly Twitter)' },
				{ id: 6, text: 'Watch Youtube' }
			]
		},
		{
			name: 'Completed Tasks',
			tasks: [
				{ id: 21, text: 'Prepare dinner' },
				{ id: 22, text: 'Go shopping' },
				{ id: 23, text: 'Prepare some birthday presents for Nour' }
			]
		}
	];

	function handleDragEnter(e: DragEvent) {}
	function handleDragLeave(e: DragEvent) {}
	function handleDragDrop(e: DragEvent, basketIndex: number) {
		e.preventDefault();
		if (e.target instanceof Element) {
			const id = e.dataTransfer?.getData('text');
			console.log('drop', basketIndex, id);
			/* move element with id to this backet */
		}
	}
	function handleDragStart(e: DragEvent) {
		if (!e.dataTransfer) {
			return;
		}
		if (e.target instanceof Element) {
			e.dataTransfer.dropEffect = 'move';
			e.dataTransfer.setData('text', e.target.getAttribute('id') || '');
		}
	}
	let activeEvent = '';
	let originalPos = { x: 0, y: 0 };
	function handleTouchStart(e: TouchEvent) {
		activeEvent = 'start';
		if (e.target instanceof Element) {
			// originalPos = { x: e.target.offsetLeft, y: e.target.offsetTop };
		}
	}
	function handleTouchMove(e: TouchEvent) {
		const touchLocation = e.targetTouches[0];
		activeEvent = 'move';
	}
	function handleTouchEnd(e: TouchEvent) {
		e.preventDefault();
		if (activeEvent === 'move') {
			/* detect if we move to another half and drop it there */
			/* otherwise restore original position */
		}
	}
</script>

<div class="w-full px-20 py-10">
	<Clock />

	<Resizable.PaneGroup direction="horizontal" class="min-h-96 rounded-lg border">
		{#each baskets as basket, basketIndex (basket)}
			{#if basketIndex > 0}
				<Resizable.Handle />
			{/if}
			<Resizable.Pane>
				<div class="flex h-full w-full flex-col items-center justify-center p-6">
					<h1 class="text-lg font-bold tracking-tight">{basket.name}</h1>
					<div
						id={basket.name}
						role="list"
						class="flex h-full w-full flex-row flex-wrap items-center justify-center p-6"
						on:dragenter={handleDragEnter}
						on:dragleave={handleDragLeave}
						on:drop={(ev) => handleDragDrop(ev, basketIndex)}
						on:dragover={(ev) => ev.preventDefault()}
					>
						{#each basket.tasks as task, taskIndex (task.id)}
							<div
								role="article"
								id={task.id.toString()}
								animate:flip
								class="m-3 inline-block h-32 w-36 cursor-move border bg-yellow-200 p-2 text-lg shadow-md"
								draggable={true}
								on:dragstart={handleDragStart}
								on:touchstart={handleTouchStart}
								on:touchmove={handleTouchMove}
								on:touchend={handleTouchEnd}
							>
								{task.text}
							</div>
						{/each}
					</div>
				</div>
			</Resizable.Pane>
		{/each}
	</Resizable.PaneGroup>
</div>

<style>
	.hovering {
		border-color: orange;
	}
</style>
