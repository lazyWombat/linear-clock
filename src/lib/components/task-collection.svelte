<script lang="ts">
	import TaskCard from '$lib/components/task.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import ResizableHandle from '$lib/components/ui/resizable/resizable-handle.svelte';
	import { DragTracker, type ClientPointType, type PointerEventType } from '$lib/drag-tracker';
	import { cn } from '$lib/utils';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';

	const [send, receive] = crossfade({});
	type TaskType = {
		id: string;
		name: string;
		completed?: boolean;
	};

	export let tasks: TaskType[];
	$: pending = tasks.filter((task) => !task.completed);
	$: completed = tasks.filter((task) => task.completed);
	const preventDefault = (event: Event) => event.preventDefault();

	let boundedAreaElement: HTMLElement;
	let completedAreaElement: HTMLElement;

	const dragTracker = DragTracker();
	let originalPos: ClientPointType;
	let offset: ClientPointType;
	let boundedArea: DOMRect;
	let targetRect: DOMRect;
	let targetPos: ClientPointType;

	let selectedTask: TaskType | undefined;
	function down(e: PointerEventType): void {
		e.preventDefault();
		originalPos = dragTracker.pointerDown(e);
		targetPos = originalPos;
		if (
			e.target instanceof HTMLElement &&
			e.target.parentElement &&
			e.target.parentElement.id &&
			e.target.parentElement.id.startsWith('task ')
		) {
			boundedArea = boundedAreaElement.getBoundingClientRect();
			const target = e.target.parentElement;
			targetRect = target.getBoundingClientRect();
			offset = {
				clientX: originalPos.clientX - targetRect.left,
				clientY: originalPos.clientY - targetRect.top
			};
			const taskId = target.id.substring(5);
			const taskIndex = tasks.findIndex((t) => t.id === taskId);
			selectedTask = tasks[taskIndex];
		}
	}
	function up(e: PointerEventType): void {
		if (selectedTask) {
			const completedArea = completedAreaElement.getBoundingClientRect();
			// no need to check Y since we are only moving horizontally
			const isInCompletedArea =
				targetPos.clientX > completedArea.left && targetPos.clientX < completedArea.right;
			if (isInCompletedArea && !selectedTask.completed) {
				selectedTask.completed = true;
				tasks.push(tasks.splice(tasks.indexOf(selectedTask), 1)[0]);
				tasks = tasks;
			} else if (!isInCompletedArea && selectedTask.completed) {
				selectedTask.completed = false;
				tasks.push(tasks.splice(tasks.indexOf(selectedTask), 1)[0]);
				tasks = tasks;
			}

			console.log(tasks);
		}
		selectedTask = undefined;
		const force = dragTracker.pointerUp(e);
		if (force.clientX > 2) {
			// TODO: handle flick
		}
	}
	function move(e: PointerEventType): void {
		if (!selectedTask) return;
		if (e.cancelable) {
			e.preventDefault();
		}
		const pos = dragTracker.pointerMove(e);
		targetPos = {
			clientX: targetPos.clientX + pos.clientX,
			clientY: targetPos.clientY + pos.clientY
		};

		if (targetPos.clientX < boundedArea.left + offset.clientX) {
			targetPos.clientX = boundedArea.left + offset.clientX;
		}
		if (targetPos.clientY < boundedArea.top + offset.clientY) {
			targetPos.clientY = boundedArea.top + offset.clientY;
		}
		if (targetPos.clientX + targetRect.width > boundedArea.right + offset.clientX) {
			targetPos.clientX = boundedArea.right - targetRect.width + offset.clientX;
		}
		if (targetPos.clientY + targetRect.height > boundedArea.bottom + offset.clientY) {
			targetPos.clientY = boundedArea.bottom - targetRect.height + offset.clientY;
		}
	}
	function click(e: PointerEventType): void {
		e.preventDefault();
	}
</script>

<svelte:window
	on:dragstart={preventDefault}
	on:touchstart|nonpassive={down}
	on:mousedown|nonpassive={down}
	on:touchcancel|nonpassive={up}
	on:contextmenu|nonpassive={up}
	on:touchmove|nonpassive={move}
	on:touchend|nonpassive={up}
	on:mousemove|nonpassive={move}
	on:mouseup|nonpassive={up}
	on:click|capture={click}
/>

<div class="mx-auto px-3" bind:this={boundedAreaElement}>
	<Resizable.PaneGroup direction="horizontal" class="min-h-96 rounded-lg border">
		<Resizable.Pane defaultSize={80} minSize={80} class="m-2 mt-4">
			<h1 class="text-center text-lg font-bold tracking-tight">Tasks</h1>
			<ul id="tasks" class="flex flex-row flex-wrap gap-2 p-3">
				{#each pending as task (task.id)}
					<li id="task {task.id.toString()}" animate:flip>
						<TaskCard description={task.name} selected={task === selectedTask} />
					</li>
				{/each}
			</ul>
		</Resizable.Pane>
		<ResizableHandle />
		<Resizable.Pane minSize={20} class="m-2 mt-4">
			<div bind:this={completedAreaElement}>
				<h1 class="pb-8 text-center text-lg font-bold tracking-tight">Completed Tasks</h1>
				<div id="tasks" class="relative mx-auto p-3">
					{#each completed as task, i (task.id)}
						<div id="task {task.id.toString()}" animate:flip>
							<TaskCard
								description={task.name}
								selected={task === selectedTask}
								class={cn(
									'absolute left-0 right-0 mx-auto',
									completed.length > 1 && i === 0 && 'rotate-12',
									completed.length > 2 && i === 1 && '-rotate-12'
								)}
							/>
						</div>
					{/each}
				</div>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
{#if selectedTask}
	<div
		class="absolute z-30"
		style={`left:${targetPos.clientX - offset.clientX}px;top:${targetPos.clientY - offset.clientY}px`}
	>
		<TaskCard description={selectedTask.name} />
	</div>
{/if}
