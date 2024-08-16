<script lang="ts">
	import * as DropdownMenu from './ui/dropdown-menu';
	import * as Avatar from './ui/avatar';
	import { Button } from './ui/button';
	import SignedIn from './firebase/SignedIn.svelte';
	import SignedOut from './firebase/SignedOut.svelte';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	const googleAuthProvider = new GoogleAuthProvider();

	let addedClass: string | null | undefined = undefined;
	export { addedClass as class };
</script>

<div class={addedClass}>
	<SignedIn let:user let:signOut>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
					<Avatar.Root class="h-8 w-8">
						<Avatar.Image src={user.photoURL} alt="avatar" />
						<Avatar.Fallback
							>{user && user.displayName
								? user.displayName
										.split(' ')
										.slice(0, 2)
										.map((p) => p[0])
										.join()
								: '?'}</Avatar.Fallback
						>
					</Avatar.Root>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56" align="end">
				<DropdownMenu.Label class="font-normal">
					<div class="flex flex-col space-y-1">
						<p class="text-sm font-medium leading-none">{user.displayName}</p>
						<p class="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item on:click={signOut}>Sign out</DropdownMenu.Item>
				<DropdownMenu.Item
					on:click={() => {
						console.log(user);
					}}>Console</DropdownMenu.Item
				>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</SignedIn>
	<SignedOut let:auth>
		<Button
			on:click={() => signInWithPopup(auth, googleAuthProvider)}
			class="flex h-8 w-auto gap-2 rounded-lg border border-slate-200 px-4 py-6 text-lg text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-slate-300"
		>
			<img class="h-6 w-6" src="/google-color.svg" alt="Google Logo" loading="lazy" />
			<span>Continue with Google</span>
		</Button>
	</SignedOut>
</div>
