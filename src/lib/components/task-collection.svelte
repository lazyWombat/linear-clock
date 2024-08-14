<script lang="ts">
	import TaskCard from '$lib/components/task.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import ResizableHandle from '$lib/components/ui/resizable/resizable-handle.svelte';
	import {
		DragTracker,
		type ClientPointType,
		type DragTrackerType,
		type PointerEventType
	} from '$lib/drag-tracker';
	import { cn } from '$lib/utils';

	type Task = {
		id: number;
		name: string;
		completed?: boolean;
	};

	export let tasks: Task[];
	$: completed = tasks.filter((task) => task.completed);
	const preventDefault = (event: Event) => event.preventDefault();

	const dragTracker = DragTracker();
	let originalPos: ClientPointType;
	let targetPos: ClientPointType;

	let isDragging = false;
	function down(e: PointerEventType): void {
		originalPos = dragTracker.pointerDown(e);
		targetPos = originalPos;
		isDragging = true;
	}
	function up(e: PointerEventType): void {
		isDragging = false;
		const force = dragTracker.pointerUp(e);
		if (force.clientX > 2) {
			console.log('flick', force);
		}
	}
	function move(e: PointerEventType): void {
		if (e.cancelable) {
			e.preventDefault();
		}
		const pos = dragTracker.pointerMove(e);
		targetPos = {
			clientX: targetPos.clientX + pos.clientX,
			clientY: targetPos.clientY + pos.clientY
		};
		e.target.style.position = 'absolute';
		e.target.style.zIndex = '1000';
		e.target.style.left = `${targetPos.clientX}px`;
		e.target.style.top = `${targetPos.clientY}px`;
	}
</script>

<div class="mx-auto px-3">
	<Resizable.PaneGroup direction="horizontal" class="min-h-96 rounded-lg border">
		<Resizable.Pane defaultSize={80} minSize={80} class="m-2 mt-4">
			<h1 class="text-center text-lg font-bold tracking-tight">Tasks</h1>
			<div id="tasks" class="flex flex-row flex-wrap gap-2 p-3">
				{#each tasks as task}
					{#if !task.completed}
						<TaskCard
							description={task.name}
							id={task.id.toString()}
							on:dragstart={preventDefault}
							on:touchstart={down}
							on:mousedown={down}
							on:touchcancel={up}
							on:contextmenu={up}
							on:touchmove={move}
							on:touchend={up}
							on:mousemove={move}
							on:mouseup={up}
						/>
					{/if}
				{/each}
			</div>
		</Resizable.Pane>
		<ResizableHandle />
		<Resizable.Pane minSize={20} class="m-2 mt-4">
			<h1 class="pb-8 text-center text-lg font-bold tracking-tight">Completed Tasks</h1>
			<div id="tasks" class="relative mx-auto p-3">
				{#each completed as task, i}
					{#if i < 3}
						<TaskCard
							description={task.name}
							id={task.id.toString()}
							class={cn(
								'absolute left-0 right-0 mx-auto',
								completed.length > 1 && i === 0 && 'rotate-12',
								completed.length > 2 && i === 1 && '-rotate-12'
							)}
						/>
					{/if}
				{/each}
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
