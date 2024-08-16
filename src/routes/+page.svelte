<script lang="ts">
	import Clock from '$lib/components/clock.svelte';
	import Collection from '$lib/components/firebase/Collection.svelte';
	import SignedIn from '$lib/components/firebase/SignedIn.svelte';
	import SignedOut from '$lib/components/firebase/SignedOut.svelte';
	import TaskCollection from '$lib/components/task-collection.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getFirebaseContext } from '$lib/stores/sdk';
	import { GoogleAuthProvider, signInAnonymously, signInWithPopup } from 'firebase/auth';
	import {
		query,
		doc,
		collection,
		orderBy,
		type DocumentData,
		updateDoc,
		serverTimestamp
	} from 'firebase/firestore';

	const googleAuthProvider = new GoogleAuthProvider();

	const firestore = getFirebaseContext().firestore!;

	interface TaskType extends DocumentData {
		name: string;
		completed: boolean;
	}
	$: makeQuery = (uid: string) => {
		const q = query(
			collection<TaskType, TaskType>(firestore, 'clocks', uid, 'tasks'),
			orderBy('modifiedOn')
		);
		return q;
	};
	async function changeTaskCompletionStatus(uid: string, taskId: string, completed: boolean) {
		const docRef = doc(firestore, 'clocks', uid, 'tasks', taskId);
		await updateDoc(docRef, { completed, modifiedOn: serverTimestamp() });
	}
</script>

<div class="w-full justify-center px-20 py-10">
	<Clock />
	<SignedIn let:user>
		{#if user && !user.isAnonymous}
			<Collection ref={makeQuery(user.uid)} startWith={[]} let:data={tasks}>
				<TaskCollection
					{tasks}
					changeTaskCompletionStatus={(taskId, completed) =>
						changeTaskCompletionStatus(user.uid, taskId, completed)}
				/>
			</Collection>
		{/if}
	</SignedIn>
	<SignedOut let:auth>
		<div class="flex flex-col justify-center">
			<h1 class="mb-16 mt-32 text-center text-4xl">Please Sign In to see tasks</h1>
			<div class="mx-auto flex flex-col justify-center gap-8">
				<Button
					on:click={() => signInWithPopup(auth, googleAuthProvider)}
					class="mx-auto flex gap-2 rounded-lg border border-slate-200 px-4 py-6 text-lg text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-slate-300"
				>
					<img class="h-6 w-6" src="/google-color.svg" alt="Google Logo" loading="lazy" />
					<span>Continue with Google</span>
				</Button>
				<a
					href={'#'}
					on:click|preventDefault={() => signInAnonymously(auth)}
					class="mx-auto font-medium text-blue-600 hover:underline dark:text-blue-500"
				>
					<span>Or continue Anonymously without tasks</span>
				</a>
			</div>
		</div>
	</SignedOut>
</div>
