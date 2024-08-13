<script lang="ts">
	import * as Card from './ui/card';

	export let description: string;
</script>

<Card.Root>
	<Card.Content>{description || ''}</Card.Content>
</Card.Root>
