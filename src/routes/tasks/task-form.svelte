<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';

	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<FormSchema>>;
	export let submit: (data: Infer<FormSchema>) => void = () => {};

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, constraints, errors, validateForm, reset } = form;

	const handleSubmit = async () => {
		const result = await validateForm();
		if (!result.valid) {
			errors.update((v) => {
				return { ...v, task: result.errors.task };
			});
			return;
		}
		submit(result.data);
		errors.clear();
		reset();
	};
</script>

<form on:submit|preventDefault={handleSubmit}>
	<Form.Field {form} name="task">
		<Form.Control let:attrs>
			<Input
				{...attrs}
				bind:value={$formData.task}
				{...$constraints.task}
				placeholder="Enter a new task here"
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</form>
