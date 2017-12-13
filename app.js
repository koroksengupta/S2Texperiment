const express = require('express')
const thesaurus = require("thesaurus");
const updated_thesaurus = thesaurus.load("./theraus/th_en_US_new.dat");
const app = express()

app.use(express.static('public'))

app.get('/similarwords', (req, res) => {
	const queryWord = req.query['word'];
	const similarWords = updated_thesaurus.find(queryWord)
	res.json({data: similarWords })
});

app.listen(3000, () => console.log('App listening on port 3000'))
