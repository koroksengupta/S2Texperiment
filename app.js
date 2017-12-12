const express = require('express')
const thesaurus = require("thesaurus");
const app = express()

app.use(express.static('public'))

app.get('/similarwords', (req, res) => {
	const queryWord = req.query['word'];
	const similarWords = thesaurus.find(queryWord)
	res.json({data: similarWords })
});

app.listen(3000, () => console.log('App listening on port 3000'))
