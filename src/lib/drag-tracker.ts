export type PointerEventType = MouseEvent | TouchEvent;
export type ClientPointType = { clientX: number; clientY: number };
export type DragTrackerType = {
	pointerDown: (e: PointerEventType) => ClientPointType;
	pointerMove: (e: PointerEventType) => ClientPointType;
	pointerUp: (e: PointerEventType) => ClientPointType;
	readPoint: (e: PointerEventType) => ClientPointType;
};

const isMouseEvent = (e: PointerEventType): e is MouseEvent =>
	typeof window.MouseEvent !== 'undefined' && e instanceof window.MouseEvent;

export function DragTracker(): DragTrackerType {
	const logInterval = 180;

	let startEvent: PointerEventType;
	let lastEvent: PointerEventType;

	const readTime = (e: PointerEventType) => e.timeStamp;
	const readPoint = (e: PointerEventType) => (isMouseEvent(e) ? e : e.touches[0]);
	function pointerDown(e: PointerEventType) {
		startEvent = lastEvent = e;
		return readPoint(e);
	}
	const subtractPoints = (a: ClientPointType, b: ClientPointType): ClientPointType => ({
		clientX: a.clientX - b.clientX,
		clientY: a.clientY - b.clientY
	});
	function pointerMove(e: PointerEventType) {
		const diff = subtractPoints(readPoint(e), readPoint(lastEvent));
		const expired = readTime(e) - readTime(startEvent) > logInterval;
		lastEvent = e;
		if (expired) {
			startEvent = e;
		}
		return diff;
	}
	function pointerUp(e: PointerEventType) {
		if (!startEvent || !lastEvent) return { clientX: 0, clientY: 0 };
		const diffDrag = subtractPoints(readPoint(lastEvent), readPoint(startEvent));
		const diffTime = readTime(e) - readTime(startEvent);
		const expired = readTime(e) - readTime(lastEvent) > logInterval;
		const force = { clientX: diffDrag.clientX / diffTime, clientY: diffDrag.clientY / diffTime };
		const isXFlick = diffTime && !expired && Math.abs(force.clientX) > 0.1;
		const isYFlick = diffTime && !expired && Math.abs(force.clientY) > 0.1;
		const forceX = isXFlick ? force.clientX : 0;
		const forceY = isYFlick ? force.clientY : 0;

		return { clientX: forceX, clientY: forceY };
	}
	const self: DragTrackerType = {
		pointerDown,
		pointerMove,
		pointerUp,
		readPoint
	};
	return self;
}
