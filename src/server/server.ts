import express from 'express';
import path from 'path';
import cron from 'node-cron';
import {dataCollection} from './dataCollection';
import * as fs from 'fs';

const app = express();

app.use('/HoloRanking', express.static(path.resolve('./', 'dist')));

app.get('/HoloRanking/api/songsdata', async (req, res) => {
	const today = new Date();
	today.setHours(today.getHours() - 6);
	const previous = new Date();
	previous.setHours(previous.getHours() - 6);
	const lastPrevious = new Date();
	lastPrevious.setHours(lastPrevious.getHours() - 6);

	switch (req.query.period) {
	case 'weekly':
		previous.setDate(previous.getDate() - 7);
		lastPrevious.setDate(lastPrevious.getDate() - 14);
		break;
	case 'monthly':
		previous.setMonth(previous.getMonth() - 1);
		lastPrevious.setMonth(lastPrevious.getMonth() - 2);
		break;
	}
	try {
		const sendData = await Promise.all([
			fs.promises.readFile(`./songsData/${today.getFullYear()}${('0'+(today.getMonth()+1)).slice(-2)}${('0'+today.getDate()).slice(-2)}.json`, 'utf-8'),
			fs.promises.readFile(`./songsData/${previous.getFullYear()}${('0'+(previous.getMonth()+1)).slice(-2)}${('0'+previous.getDate()).slice(-2)}.json`, 'utf-8'),
			fs.promises.readFile(`./songsData/${lastPrevious.getFullYear()}${('0'+(lastPrevious.getMonth()+1)).slice(-2)}${('0'+lastPrevious.getDate()).slice(-2)}.json`, 'utf-8'),
		]);
		res.send([JSON.parse(sendData[0]), JSON.parse(sendData[1]), JSON.parse(sendData[2])]);
	} catch (e) {
		console.log(e);
		res.sendStatus(204);
	}
});

app.listen(3000, () => {
	console.log('server running');
});

cron.schedule('0 6 * * *', () => {
	dataCollection();
});
