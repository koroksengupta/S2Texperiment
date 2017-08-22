declare var webkitSpeechRecognition:any;
declare var $:any;
//TODO:
// currently if editing is done then added element will taken as one word.
const startBtn = document.getElementById("btn-start");
const stopBtn = document.getElementById("btn-stop");
const resultDiv = document.getElementById('result');

const speechRecognizer = new webkitSpeechRecognition();

speechRecognizer.continuous = true;
speechRecognizer.interimResults = true;
speechRecognizer.lang = 'en-US';

let currentParagraph = 0;
let currentContainer: HTMLSpanElement;

const createContainer = (i: number): HTMLSpanElement => {
	let elem = document.createElement("span");
	elem.id = `container-${i}`;
	elem.classList.add(`span-wrapper`);
	return elem;
};

const splitText = (text: string): string[] => text.split(' ');
const wrapWithSpan = (texts: string[]) => texts.map((elem: string, index: number) => `<span class="transcribed-text"> ${elem} </span>`);

const getCurrentContainer = (containerId: number, prefix: string = 'container-') => {
	let element = <HTMLSpanElement>document.getElementById(prefix + containerId)
	if (element == null) {
		element = createContainer(containerId);
		resultDiv!.appendChild(element);
	}
	return element;
}
const processTranscript = (transcript: string) => {
	let container = getCurrentContainer(currentParagraph);
	console.log(container);
	container!.innerHTML = wrapWithSpan(splitText(transcript)).join(" ");
}

speechRecognizer.onresult = (event: any) => {
	var result = event.results[event.results.length-1];
	if (result[0].confidence > 0.60) {
		processTranscript(result[0].transcript);
	}
};

speechRecognizer.onerror = (evt: ErrorEvent) => {
	alert("Error occured");
}

startBtn!.addEventListener('click', (evt: MouseEvent) => {
	currentParagraph += 1;
	speechRecognizer.start();
});

stopBtn!.addEventListener('click', (evt: MouseEvent) => {
	speechRecognizer.stop();
});


let mouseTimer: number;

$(document).on('mouseenter', '.transcribed-text', (evt: MouseEvent) => {
	console.log('mouse enter');
	mouseTimer = setTimeout(() => {
		$(evt.currentTarget).addClass('selected');
	}, 1000);
});


$(document).on('mouseout', '.transcribed-text', (evt: MouseEvent) => {
	$(evt.currentTarget).removeClass('selected');
	// setTimeout(mouseTimer);
	console.log('mouse out')
});



