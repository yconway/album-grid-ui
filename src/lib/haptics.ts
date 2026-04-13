// Web Vibration API. Works on Android/Chrome; iOS Safari silently no-ops
// since there's no public haptics API on iOS web.

export function bigTick(): void {
	tryVibrate(40)
}

export function smallTick(): void {
	tryVibrate(4)
}

function tryVibrate(durationMs: number): void {
	if (
		typeof navigator !== "undefined" &&
		typeof navigator.vibrate === "function"
	) {
		navigator.vibrate(durationMs)
	}
}
