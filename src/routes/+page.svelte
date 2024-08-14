<script lang="ts">
	import Clock from '$lib/components/clock.svelte';
	import TaskCollection from '$lib/components/task-collection.svelte';

	const tasks = [
		{ id: 1, name: 'Cook dinner', completed: false },
		{ id: 2, name: 'Clean the house', completed: true },
		{ id: 3, name: 'Do laundry', completed: false },
		{ id: 4, name: 'Buy groceries', completed: false },
		{ id: 5, name: 'Read a book', completed: true },
		{ id: 6, name: 'Go for a walk', completed: false },
		{ id: 7, name: 'Call a friend', completed: true },
		{ id: 8, name: 'Write a letter', completed: false },
		{ id: 9, name: 'Practice guitar', completed: false },
		{ id: 10, name: 'Learn something new', completed: true }
	];
</script>

<div class="w-full justify-center px-20 py-10">
	<Clock />
	<TaskCollection {tasks} />
</div>
