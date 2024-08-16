<script lang="ts">
	import SignedIn from '$lib/components/firebase/SignedIn.svelte';
	import SignedOut from '$lib/components/firebase/SignedOut.svelte';
	import UserNav from '$lib/components/user-nav.svelte';
	import type { User } from 'firebase/auth';

	interface $$Slots {
		default: {
			user: User;
		};
	}
</script>

<nav class="border-gray-200 bg-white dark:bg-gray-900">
	<div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
		<a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<span class="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"
				>Linear Clock</span
			>
		</a>
		<UserNav />
	</div>
</nav>
<SignedIn let:user>
	{#if user.isAnonymous}
		<h1 class="mb-16 mt-32 text-center text-4xl">Anonymous Users cannot manage tasks</h1>
		<h2 class="mb-16 mt-32 text-center text-2xl text-muted-foreground">
			Please Sign In using Google
		</h2>
	{:else}
		<div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
			<slot />
		</div>
	{/if}
</SignedIn>
<SignedOut>
	<h1 class="mb-16 mt-32 text-center text-4xl">Please Sign In</h1>
</SignedOut>
