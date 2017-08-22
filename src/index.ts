import {createContainer, wrapWithSpan, splitText } from './utils';
import { SpeechToText } from './speechtotext';

declare var Levenshtein: any;
declare var webkitSpeechRecognition:any;
declare var $:any;

//TODO:
// currently if editing is done then added element will taken as one word.

let startBtn: HTMLButtonElement;
let editBtn: HTMLButtonElement;
let resultDiv:HTMLButtonElement;
let okButton:HTMLButtonElement;
let inputParagraphs: string[];
let paragraphContainer: HTMLElement;
let currentIndex = 0;
let isInEditingMode = false;
let currentParagraph = 0;
let currentContainer: HTMLSpanElement;

const showParagraph = () => {
	paragraphContainer!.innerHTML = inputParagraphs[currentIndex];
}


// this is impure function.
const processTranscript = (transcript: string) => {
	// let container = getCurrentContainer(currentParagraph);
	resultDiv!.innerHTML = wrapWithSpan(splitText(transcript)).join(" ");
};

const clearResultDiv = () => {
	setTimeout(() => {
		resultDiv!.innerText = "";
	}, 500);
};


const submitResult = (speechRecognizer: SpeechToText) => {
	// stop the speech api
	speechRecognizer.stop();
	const orginalText = inputParagraphs[currentIndex];
	const resultText = resultDiv.innerText;
	const l = new Levenshtein(orginalText, resultText);
	console.log({
		orginalText,
		resultText,
		distance: l.distance
	});
	clearResultDiv();
	currentIndex += 1;
	showParagraph();
};

const bindEvents = (speechRecognizer: SpeechToText) => {
	startBtn!.addEventListener('click', (evt: MouseEvent) => {
		speechRecognizer.start();
	});

	editBtn!.addEventListener('click', (evt: MouseEvent) => {
		isInEditingMode = true;
		speechRecognizer.stop();
	});

	okButton!.addEventListener('click', (evt: MouseEvent) => {
		submitResult(speechRecognizer);
	});

	let mouseTimer: number;
	$(document).on('mouseenter', '.transcribed-text', (evt: MouseEvent) => {
		mouseTimer = setTimeout(() => {
			$(evt.currentTarget).addClass('selected');
		}, 1000);
	});
	$(document).on('mouseout', '.transcribed-text', (evt: MouseEvent) => {
		$(evt.currentTarget).removeClass('selected');
		// setTimeout(mouseTimer);
		console.log('mouse out')
	});
};

const initializeApp = (paragraphs: string[]) => {
	// setup buttons
	startBtn = <HTMLButtonElement>document.getElementById('btn-start');
	editBtn = <HTMLButtonElement>document.getElementById('btn-edit');
	resultDiv = <HTMLButtonElement>document.getElementById('result');
	okButton = <HTMLButtonElement>document.getElementById('btn-ok');
	paragraphContainer = <HTMLElement>document.getElementById('paragraph-container');
	inputParagraphs = paragraphs;
	showParagraph();

	// initializing our object
	const speechRecognizer = new SpeechToText();
	speechRecognizer.on('onresult', (event: any, result: string) => {
		processTranscript(result);
	});
	bindEvents(speechRecognizer);
}


const loadJson = (filePath:string) => {
	fetch(filePath).then((rep) => rep.json()).then(data => {
		initializeApp(data.paragraphs);
	});
};

window.addEventListener('load', (evt:Event) => {
	loadJson('inputs.json')
});




