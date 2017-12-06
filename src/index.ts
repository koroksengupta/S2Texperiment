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
	$('#keyboard').val('');
	$(".transcribed-text").removeClass("selected");
}
const removePopovers = () => {
	$(".popover").popover('destroy');
}

// keyboard plugins
// milliseconds before a hovered key is first typed
var regularKeyHoverTimer = 1500;

// milliseconds (ms) unitl the hover key starts repeating
var regularKeyHoverRepeat = 0;
// approximate repeat rate in characters per second
var regularKeyRepeatRate = 1;
// milliseconds before an action (shift, accept & cancel) is performed
// we don't want to repeat action keys!
var actionKeyHoverTimer = 1500;

var internalTimer: number, lastKey: number;

function startTimer($key:any, isAction: any) {
	clearTimeout(internalTimer);
	// if it's an action key, wait longer AND do not repeat
	internalTimer = setTimeout(function() {
	// use 'mousedown' to trigger typing
	$key.trigger('mousedown');
	}, isAction ? actionKeyHoverTimer : regularKeyHoverTimer);
}

$('#keyboard').keyboard({
	repeatDelay: regularKeyHoverRepeat,
	repeatRate: regularKeyRepeatRate,
	visible: function(event: any, keyboard: any) {
		keyboard.$keyboard.find('button')
			.on('mouseenter', function(event: any) {
				var $key = $(event.currentTarget),
					action = $key.attr('data-action'),
					isAction = action in $.keyboard.keyaction;
				// don't repeat action keys
				if (isAction && keyboard.last.key === action) return;
				startTimer($key, isAction);
			})
			.on('mouseleave', function() {
				clearTimeout(internalTimer);
			});
		},
	hidden: function() {
		clearTimeout(internalTimer);
	},
	accepted : function(event: any, keyboard: any, el: any) {
		var value = el.value;
		
		$(".selected").text(value);
		
	},
	canceled: function(event: Event, keyboard: any, el: any) {
		removeSelected();
	},
	beforeClose: function() {
		
		
		
		setTimeout(function() {
			removeSelected();
		}, 100);
	}
});



const bindEvents = (speechRecognizer: SpeechToText) => {
	startBtn!.addEventListener('click', (evt: MouseEvent) => {
		startTime = new Date()
		speechRecognizer.start();
		$(evt.currentTarget).css('display', 'none');
	});

	editBtn!.addEventListener('click', (evt: MouseEvent) => {
		var results = resultDiv.innerText;
		if (results.trim() == '') return false;

		isInEditingMode = !isInEditingMode;
		if (isInEditingMode) {
			resultDiv.classList.add('editing-mode');
		} else {
			resultDiv.classList.remove('editing-mode');
		}
		speechRecognizer.stop();
	});

	okButton!.addEventListener('click', (evt: MouseEvent) => {
		$(evt.currentTarget).attr('disabled', true);
		speechRecognizer.abort();
		speechRecognizer.stop();
		isInEditingMode = false;
		resultDiv.classList.remove('editing-mode');

		try {
			speechRecognizer.start();
		} catch(err) {
			setTimeout(() => {
				speechRecognizer.start();
			}, 200);
		} finally {
			submitResult(speechRecognizer);
			$(evt.currentTarget).removeAttr('disabled');
		}
	});

	$('body').popover({
		selector: '.transcribed-text',
		trigger: 'click',
		html: true,
		placement: 'bottom',
		toggle: true,
		content() {
			return `<div class="btn-group" role="group" aria-label="Option Buttons">
			<button type="button" class="btn btn-success" id="edit">Edit</button>
			<button type="button" class="btn btn-danger" id="delete">Delete</button>
		  </div>`;
		}
	});

	$(document).on('mouseenter', '.transcribed-text', (evt: MouseEvent) => {
		const elem = $(evt.currentTarget);
		if (!isInEditingMode) return;
		setTimeout(() => {
			if (elem.hasClass('selected')) return;
			removeSelected();
			removePopovers();
			elem.addClass('selected');
			elem.click();
		}, 1000);
	});

	$(document).on('click', '#edit', (evt: MouseEvent) => {
		removePopovers();
		$("#keyboard").trigger('focus');
	})
	.on('click', '#delete', (evt: MouseEvent) => {
		$(".selected").remove();
		removeSelected();
		removePopovers();
	});

	let timer: number;
	$(document).on( 'mouseover', '.hoverClickable', (e: MouseEvent) => {
		const hoveredElement = $(e.currentTarget).attr('id');
		setTimeout(() => {
			$("#" + hoveredElement)[0].click();
		}, 1500);
	});
	$( document ).on( 'mouseout', '.hoverClickable', (e: MouseEvent) => {
		clearInterval(timer);
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
	loadJson('inputs.json');
});




