declare var webkitSpeechRecognition:any;

export class SpeechToText {
	private speechRecognizer: any;

	constructor() {
		this.speechRecognizer = new webkitSpeechRecognition();
		this.addEvents();
	}

	private addEvents(): void {
		this.speechRecognizer.onresult = (event: any) => {
			var result = event.results[event.results.length-1];
			if (result[0].confidence > 0.60) {
				resultDiv!.innerHTML = wrapWithSpan(splitText(result[0].transcript)).join(" ");
			}
		};
	}
	start() {
		this.speechRecognizer.start();
	}

	stop() {
		this.speechRecognizer.stop();
	}
}