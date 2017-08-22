declare var webkitSpeechRecognition: any;
import { ST2Event } from './event';

export class SpeechToText extends ST2Event {
	private speechRecognizer: any;

	constructor() {
		super();
		this.speechRecognizer = new webkitSpeechRecognition();
		this.speechRecognizer.continuous = true;
		this.speechRecognizer.interimResults = true;
		this.speechRecognizer.lang = 'en-US';
		this.bindEvents();
	}

	private bindEvents() {
		this.speechRecognizer.onresult = (event: any) => {
			this.handleOnResult(event);
		}
		this.speechRecognizer.onerror = (event: any) => {
			this.handleOnError(event);
		}
	}

	private handleOnError(event: ErrorEvent) {
		this.trigger(new Event('onerror'), event);
	}

	private handleOnResult(event: any) {
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