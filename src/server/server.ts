import express from 'express';
import path from 'path';
import cron from 'node-cron';
import {dataCollection} from './dataCollection';

const app = express();

app.use(express.static(path.resolve('./', 'dist')));

app.get('/HoloRanking/api/songsdata', (req, res) => {
	const date = new Date();
	date.setHours(date.getHours() - 6);
	res.sendFile(path.resolve('./', 'songsData', `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}.json`));
	switch (req.query.period) {
	case 'weekly':
		date.setDate(date.getDate() - 7);
		res.sendFile(path.resolve('./', 'songsData', `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}.json`));
		break;
	case 'monthly':
		date.setDate(date.getMonth() - 1);
		res.sendFile(path.resolve('./', 'songsData', `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}.json`));
		break;
	default:
		res.sendStatus(400);
		break;
	}
});

app.get('/HoloRanking/*', function(req, res) {
	res.sendFile(path.resolve('./', 'dist', 'index.html'));
});

app.listen(3000, () => {
	console.log('server running');
});

cron.schedule('0 6 * * *', () => {
	dataCollection();
});
