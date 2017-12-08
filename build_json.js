const fs = require('fs');
const _ = require('lodash');
const fileName = 'phrases1.txt';
const filePath = __dirname + '/' + fileName;
const desPath = __dirname + '/inputs.json';

const readFile = fileName => {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, (err, data) => {
			if (err) {
				reject(err);
			} else {
				const content = data.toString();
				const obj = {
					paragraphs: _.reject(content.split('\n'), _.isEmpty)
				};
				resolve(obj);
			}
		})
	});
};

const writeToJson = (stringObj, desPath) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(desPath, JSON.stringify(stringObj, null, 4), err => {
			if(err) {
				reject(err.message);
			}
			resolve({message: 'Written sucessfully'});
		});
	});

};

async function processFile(fileName) {
	const fileContent = await readFile(fileName);
	const message = await writeToJson(fileContent, desPath);
	console.log(message.message);
}

processFile(filePath)


