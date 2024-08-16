<script lang="ts">
	import TaskForm from './task-form.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { getFirebaseContext } from '$lib/stores/sdk';
	import {
		query,
		collection,
		orderBy,
		addDoc,
		serverTimestamp,
		doc,
		deleteDoc,
		updateDoc
	} from 'firebase/firestore';
	import Collection from '$lib/components/firebase/Collection.svelte';
	import { cn } from '$lib/utils';
	import * as Table from '$lib/components/ui/table';
	import { Trash } from 'svelte-radix';
	import { Button } from '$lib/components/ui/button';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import timer from '$lib/timer';
	import { format } from 'timeago.js';
	import SignedIn from '$lib/components/firebase/SignedIn.svelte';

	let clock = timer({ interval: 1000 });
	const firestore = getFirebaseContext().firestore!;
	$: makeQuery = (uid: string) => {
		const q = query(collection(firestore, 'clocks', uid, 'tasks') /*, orderBy('createdOn') */);
		return q;
	};

	async function addTask(uid: string, data: any) {
		const { task } = data;
		await addDoc(collection(firestore, 'clocks', uid, 'tasks'), {
			title: task,
			createdOn: serverTimestamp(),
			modifiedOn: serverTimestamp()
		});
	}

	async function changeTaskCompletionStatus(uid: string, taskId: string, completed: boolean) {
		const docRef = doc(firestore, 'clocks', uid, 'tasks', taskId);
		await updateDoc(docRef, { completed, modifiedOn: serverTimestamp() });
	}

	async function deleteTask(uid: string, taskId: string) {
		const docRef = doc(firestore, 'clocks', uid, 'tasks', taskId);
		await deleteDoc(docRef);
	}
	const data = {};
</script>

<div class="w-full justify-center px-20 py-10">
	<SignedIn let:user>
		<div class="mx-auto max-w-[800px]">
			<div class="m-10 mx-auto">
				<h1 class="my-6 text-center font-clockFont text-4xl tracking-tight">Tasks</h1>
				<TaskForm {data} submit={(data) => addTask(user.uid, data)} />
			</div>
			<Collection ref={makeQuery(user.uid)} startWith={[]} let:data={tasks}>
				{#if tasks && tasks.length > 0}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-[50px]"></Table.Head>
								<Table.Head>Task</Table.Head>
								<Table.Head class="w-[150px]">Modified</Table.Head>
								<Table.Head class="w-[50px] text-center"></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each tasks as task (task.id)}
								<Table.Row>
									<Table.Cell>
										<Checkbox
											bind:checked={task.completed}
											on:click={(e) => {
												e.preventDefault();
												changeTaskCompletionStatus(user.uid, task.id, !task.completed);
											}}
										/>
									</Table.Cell>
									<Table.Cell class={cn(task.completed && 'text-muted-foreground line-through')}>
										{task.title}
									</Table.Cell>
									<Table.Cell class={cn(task.completed && 'text-muted-foreground')}>
										{#if task && task.modifiedOn && task.modifiedOn.seconds}
											{format(new Date(task.modifiedOn.seconds * 1000), undefined, {
												relativeDate: $clock
											})}
										{/if}
									</Table.Cell>
									<Table.Cell>
										<Button
											variant="destructive"
											size="icon"
											on:click={() => deleteTask(user.uid, task.id)}
										>
											<Trash class="h-5 w-5" />
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{:else}
					<p class="text-center text-muted-foreground">No tasks found.</p>
				{/if}
			</Collection>
		</div>
	</SignedIn>
</div>
