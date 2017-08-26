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
let startTime: Date;
let endTime: Date;

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
	endTime = new Date();

	const totalTime = (endTime.getTime() - startTime.getTime()) / 1000;

	console.log({
		orginalText,
		resultText,
		distance: l.distance,
		timetaken: totalTime + 'seconds'
	});

	// reset all
	clearResultDiv();
	currentIndex += 1;
	showParagraph();
};

const removeSelected = () => {
	$(".transcribed-text").removeClass("selected");
}
const removePopovers = () => {
	$(".popover").popover('destroy');
}



const bindEvents = (speechRecognizer: SpeechToText) => {
	startBtn!.addEventListener('click', (evt: MouseEvent) => {
		startTime = new Date()
		speechRecognizer.start();
	});

	editBtn!.addEventListener('click', (evt: MouseEvent) => {
		resultDiv.classList.add('editing-mode');
		isInEditingMode = true;
		speechRecognizer.stop();
	});

	okButton!.addEventListener('click', (evt: MouseEvent) => {
		resultDiv.classList.remove('editing-mode');
		submitResult(speechRecognizer);
	});

	$('body').popover({
		selector: '.transcribed-text',
		trigger: 'click',
		html: true,
		placement: 'bottom',
		toggle: true,
		content() {
			return `<div class="btn-group" role="group" aria-label="Basic example">
			<button type="button" class="btn btn-success">Edit</button>
			<button type="button" class="btn btn-danger">Delete</button>
		  </div>`;
		}
	});

	$(document).on('mouseenter', '.transcribed-text', (evt: MouseEvent) => {
		setTimeout(() => {
			removeSelected();
			removePopovers();
			$(evt.currentTarget).addClass('selected');
			$(evt.currentTarget).click();
		}, 1000);
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




