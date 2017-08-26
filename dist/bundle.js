/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(1);
const speechtotext_1 = __webpack_require__(2);
//TODO:
// currently if editing is done then added element will taken as one word.
let startBtn;
let editBtn;
let resultDiv;
let okButton;
let inputParagraphs;
let paragraphContainer;
let currentIndex = 0;
let isInEditingMode = false;
let currentParagraph = 0;
let currentContainer;
let startTime;
let endTime;
const showParagraph = () => {
    paragraphContainer.innerHTML = inputParagraphs[currentIndex];
};
// this is impure function.
const processTranscript = (transcript) => {
    // let container = getCurrentContainer(currentParagraph);
    resultDiv.innerHTML = utils_1.wrapWithSpan(utils_1.splitText(transcript)).join(" ");
};
const clearResultDiv = () => {
    setTimeout(() => {
        resultDiv.innerText = "";
    }, 500);
};
const submitResult = (speechRecognizer) => {
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
};
const removePopovers = () => {
    $(".popover").popover('destroy');
};
const bindEvents = (speechRecognizer) => {
    startBtn.addEventListener('click', (evt) => {
        startTime = new Date();
        speechRecognizer.start();
    });
    editBtn.addEventListener('click', (evt) => {
        resultDiv.classList.add('editing-mode');
        isInEditingMode = true;
        speechRecognizer.stop();
    });
    okButton.addEventListener('click', (evt) => {
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
    $(document).on('mouseenter', '.transcribed-text', (evt) => {
        setTimeout(() => {
            removeSelected();
            removePopovers();
            $(evt.currentTarget).addClass('selected');
            $(evt.currentTarget).click();
        }, 1000);
    });
};
const initializeApp = (paragraphs) => {
    // setup buttons
    startBtn = document.getElementById('btn-start');
    editBtn = document.getElementById('btn-edit');
    resultDiv = document.getElementById('result');
    okButton = document.getElementById('btn-ok');
    paragraphContainer = document.getElementById('paragraph-container');
    inputParagraphs = paragraphs;
    showParagraph();
    // initializing our object
    const speechRecognizer = new speechtotext_1.SpeechToText();
    speechRecognizer.on('onresult', (event, result) => {
        processTranscript(result);
    });
    bindEvents(speechRecognizer);
};
const loadJson = (filePath) => {
    fetch(filePath).then((rep) => rep.json()).then(data => {
        initializeApp(data.paragraphs);
    });
};
window.addEventListener('load', (evt) => {
    loadJson('inputs.json');
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createContainer = (i) => {
    let elem = document.createElement("span");
    elem.id = `container-${i}`;
    elem.classList.add(`span-wrapper`);
    return elem;
};
exports.splitText = (text) => text.split(' ');
exports.wrapWithSpan = (texts) => texts.map((elem, index) => `<span class="transcribed-text">${elem}</span>`);
// Don't delete this
// const getCurrentContainer = (containerId: number, prefix: string = 'container-') => {
// 	let element = <HTMLSpanElement>document.getElementById(prefix + containerId)
// 	if (element == null) {
// 		element = createContainer(containerId);
// 		resultDiv!.appendChild(element);
// 	}
// 	return element;
// } 


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = __webpack_require__(3);
class SpeechToText extends event_1.ST2Event {
    constructor() {
        super();
        this.speechRecognizer = new webkitSpeechRecognition();
        this.speechRecognizer.continuous = true;
        this.speechRecognizer.interimResults = true;
        this.speechRecognizer.lang = 'en-US';
        this.bindEvents();
    }
    bindEvents() {
        this.speechRecognizer.onresult = (event) => {
            this.handleOnResult(event);
        };
        this.speechRecognizer.onerror = (event) => {
            this.handleOnError(event);
        };
    }
    handleOnError(event) {
        this.trigger(new Event('onerror'), event);
    }
    handleOnResult(event) {
        var result = event.results[event.results.length - 1];
        if (result[0].confidence > 0.50) {
            this.trigger(new Event('onresult'), result[0].transcript);
        }
    }
    start() {
        this.speechRecognizer.start();
    }
    stop() {
        this.speechRecognizer.stop();
    }
}
exports.SpeechToText = SpeechToText;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ST2Event {
    constructor(_listeners = []) {
        this._listeners = _listeners;
    }
    on(eventType, callFn) {
        let events = [].concat(this._listeners.map((evtObj) => Object.keys(evtObj)));
        if (events.indexOf(eventType) == -1) {
            let event = { [eventType]: [callFn] };
            this._listeners.push(event);
        }
        else {
            let event = this._listeners.filter((evetObj) => evetObj[eventType] !== undefined)[0];
            event[eventType].push(callFn);
        }
    }
    off(eventType, callFn) {
        let events = [].concat(this._listeners.map((evObj) => Object.keys(evObj)));
        if (events.indexOf(eventType) == -1)
            return;
        let event = this._listeners.filter((evtObj) => evtObj[eventType] !== undefined);
        let index = event[eventType].indexOf(callFn);
        if (index >= 0)
            event[eventType].splice(index, 1);
    }
    trigger(eventType, ...values) {
        let handlers = this._listeners.filter((listeners) => listeners[eventType.type] !== undefined);
        if (handlers.length == 0)
            return void 0;
        handlers = handlers[0][eventType.type];
        handlers.forEach((handeler) => handeler(eventType, ...values));
    }
}
exports.ST2Event = ST2Event;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map