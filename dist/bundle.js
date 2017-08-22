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
let currentContainer;
const createContainer = (i) => {
    let elem = document.createElement("span");
    elem.id = `container-${i}`;
    elem.classList.add(`span-wrapper`);
    return elem;
};
const splitText = (text) => text.split(' ');
const wrapWithSpan = (texts) => texts.map((elem, index) => `<span class="transcribed-text"> ${elem} </span>`);
const getCurrentContainer = (containerId, prefix = 'container-') => {
    let element = document.getElementById(prefix + containerId);
    if (element == null) {
        element = createContainer(containerId);
        resultDiv.appendChild(element);
    }
    return element;
};
const processTranscript = (transcript) => {
    let container = getCurrentContainer(currentParagraph);
    console.log(container);
    container.innerHTML = wrapWithSpan(splitText(transcript)).join(" ");
};
speechRecognizer.onresult = (event) => {
    var result = event.results[event.results.length - 1];
    if (result[0].confidence > 0.60) {
        processTranscript(result[0].transcript);
    }
};
speechRecognizer.onerror = (evt) => {
    alert("Error occured");
};
startBtn.addEventListener('click', (evt) => {
    currentParagraph += 1;
    speechRecognizer.start();
});
stopBtn.addEventListener('click', (evt) => {
    speechRecognizer.stop();
});
let mouseTimer;
$(document).on('mouseenter', '.transcribed-text', (evt) => {
    console.log('mouse enter');
    mouseTimer = setTimeout(() => {
        $(evt.currentTarget).addClass('selected');
    }, 1000);
});
$(document).on('mouseout', '.transcribed-text', (evt) => {
    $(evt.currentTarget).removeClass('selected');
    // setTimeout(mouseTimer);
    console.log('mouse out');
});


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map