<script lang="ts">
	import { getFirebaseContext } from '$lib/stores/sdk';
	import { userStore } from '$lib/stores/auth';
	import type { Auth } from 'firebase/auth';

	const auth = getFirebaseContext().auth!;
	const user = userStore(auth);

	interface $$Slots {
		default: { auth: Auth };
	}
</script>

{#if !$user}
	<slot {auth} />
{/if}
