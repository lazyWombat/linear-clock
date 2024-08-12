import { readable } from 'svelte/store';

type Options = {
	interval?: number;
};
export default function (options: Options = {}) {
	return readable<Date>(new Date(), (set) => {
		const update = () => set(new Date());

		update();

		const interval = setInterval(update, options.interval || 1000);

		return () => clearInterval(interval);
	});
}
