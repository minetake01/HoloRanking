import * as fs from 'fs';
import path from 'path';

import dayjs from 'dayjs';
import express from 'express';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';

import {dataCollection, getComment} from './dataCollection';
import {accessInfoLogger, systemLogger} from './logger';
import {videoDownloader} from './videoDownloader';

const app = express();

const apiLimiter = rateLimit({
	windowMs: 5 * 60000,
	max: 100,
});

app.use('/HoloRanking', express.static(path.resolve('./', 'dist')));

app.use('/HoloRanking', (req, _, next) => {
	accessInfoLogger.info(req.headers);
	next();
});

app.use('/HoloRanking/api/comment/', apiLimiter);

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
	const sendData = await Promise.all([
		fs.promises.readFile(`./songsData/${dayjs(today).format('YYYYMMDD')}.json`, 'utf-8'),
		fs.promises.readFile(`./songsData/${dayjs(previous).format('YYYYMMDD')}.json`, 'utf-8'),
		fs.promises.readFile(`./songsData/${dayjs(lastPrevious).format('YYYYMMDD')}.json`, 'utf-8'),
	]).catch((e) => {
		systemLogger.error(e);
		throw res.sendStatus(204);
	});
	res.send([JSON.parse(sendData[0]), JSON.parse(sendData[1]), JSON.parse(sendData[2])]);
});

app.get('/HoloRanking/api/comment', async (req, res) => {
	res.send(await getComment(req.query.videoid as string));
});

app.get('/HoloRanking/api/download', async (req, res) => {
	videoDownloader(`${req.query.videoid}`.split(','));
});

app.listen(3000, () => {
	systemLogger.info('server running');
});

cron.schedule('0 6 * * *', () => {
	dataCollection();
});
