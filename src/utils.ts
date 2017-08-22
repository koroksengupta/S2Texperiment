export interface Eventable {
	on(eventType: string, callFn: Function): void
	off(eventType: string, callFn: Function): void
	trigger(eventType: Event, ...values: Array<any>): void
}
export interface IEventable {
	[eventType: string]: Array<Function>
}

export const createContainer = (i: number): HTMLSpanElement => {
	let elem = document.createElement("span");
	elem.id = `container-${i}`;
	elem.classList.add(`span-wrapper`);
	return elem;
};
export const splitText = (text: string): string[] => text.split(' ');
export const wrapWithSpan = (texts: string[]) => texts.map((elem: string, index: number) => `<span class="transcribed-text">${elem}</span>`);


// Don't delete this
// const getCurrentContainer = (containerId: number, prefix: string = 'container-') => {
// 	let element = <HTMLSpanElement>document.getElementById(prefix + containerId)
// 	if (element == null) {
// 		element = createContainer(containerId);
// 		resultDiv!.appendChild(element);
// 	}
// 	return element;
// }