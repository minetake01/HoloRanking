import dayjs from 'dayjs';
import * as fs from 'fs';

import {google} from 'googleapis';
import {HolodexApiClient, VideoStatus} from 'holodex.js';

import {holodexApiKey, youtubeApiKey} from './apiKey';
import {holodexLogger, systemLogger, youtubeLogger} from './logger';

const holodex = new HolodexApiClient({
	apiKey: holodexApiKey,
});
const youtube = google.youtube({
	version: 'v3',
	auth: youtubeApiKey,
});

let songsData: {
	Music_Cover: {
		videoId: string,
		title: string | null,
		song: string[],
		artist: string[],
		author: string[],
		en_author: (string | undefined)[],
		date: Date | undefined,
		total: number,
	}[],
	Original: {
		videoId: string,
		title: string | null,
		song: string[],
		artist: string[],
		author: string[],
		en_author: (string | undefined)[],
		date: Date | undefined,
		total: number,
	}[],
} = {
	Music_Cover: [],
	Original: [],
};

export async function dataCollection() {
	systemLogger.info('Start data collect.');
	// データ読み込み
	const previousDate = new Date();
	previousDate.setDate(previousDate.getDate() - 1);
	songsData = JSON.parse(await fs.promises.readFile(`./songsData/${dayjs(previousDate).format('YYYYMMDD')}.json`, 'utf-8')
		.catch((e) => {
			throw systemLogger.error(e);
		}));
	const Member = JSON.parse(await fs.promises.readFile(`./memberList.json`, 'utf-8'));
	// Holodexから取得
	const [music_cover, original] = await Promise.all([
		holodex.getVideos({
			topic: 'Music_Cover',
			status: VideoStatus.Past,
			include: 'mentions,songs',
			sort: 'published_at',
			limit: 50,
			org: 'Hololive',
		}).catch((response) => {
			throw holodexLogger.error(response);
		}),
		holodex.getVideos({
			topic: 'Original_Song',
			status: VideoStatus.Past,
			include: 'mentions,songs',
			sort: 'published_at',
			limit: 50,
			org: 'Hololive',
		}).catch((response) => {
			throw holodexLogger.error(response);
		}),
	]);
	// 新曲を追加
	music_cover.filter((item) => !songsData.Music_Cover.some((value) => value.videoId === item.videoId))
		.forEach((value) => {
			songsData.Music_Cover.unshift({
				videoId: value.videoId,
				title: null,
				song: value.songs.map((item) => item.name),
				artist: value.songs.map((item) => item.artist),
				author: [value.channel.channelId in Member ? Member[value.channel.channelId] : value.channel.name, ...value.mentions.map((item) => item.channelId in Member ? Member[item.channelId] : item.name)],
				en_author: [value.channel.englishName, ...value.mentions.map((item) => item.englishName)],
				date: value.publishedAt,
				total: NaN,
			});
		});
	original.filter((item) => !songsData.Original.some((value) => value.videoId === item.videoId))
		.forEach((value) => {
			songsData.Original.unshift({
				videoId: value.videoId,
				title: null,
				song: value.songs.map((item) => item.name),
				artist: value.songs.map((item) => item.artist),
				author: [value.channel.channelId in Member ? Member[value.channel.channelId] : value.channel.name, ...value.mentions.map((item) => item.channelId in Member ? Member[item.channelId] : item.name)],
				en_author: [value.channel.englishName, ...value.mentions.map((item) => item.englishName)],
				date: value.publishedAt,
				total: NaN,
			});
		});
	// YouTubeから取得
	const music_coverIdList = songsData.Music_Cover.map((item) => item.videoId);
	const originalIdList = songsData.Original.map((item) => item.videoId);
	const videoIdList = [...music_coverIdList, ...originalIdList];
	for (let i = 0; i < videoIdList.length; i += 50) {
		await youtube.videos.list({
			part: ['snippet', 'statistics'],
			id: videoIdList.slice(i, i + 50),
		}).then((response) => {
			response.data.items?.forEach((item) => {
				const music_coverIndex = music_coverIdList.findIndex((value) => value === item.id);
				const originalIndex = originalIdList.findIndex((value) => value === item.id);
				if (music_coverIndex !== -1) {
					songsData.Music_Cover[music_coverIndex].title = `${item.snippet?.title}`;
					songsData.Music_Cover[music_coverIndex].total = Number(item.statistics?.viewCount);
				} else if (originalIndex !== -1) {
					songsData.Original[originalIndex].title = `${item.snippet?.title}`;
					songsData.Original[originalIndex].total = Number(item.statistics?.viewCount);
				}
			});
		}).catch((response) => {
			throw youtubeLogger.error(response);
		});
	}
	const date = new Date();
	fs.writeFileSync(`./songsData/${dayjs(date).format('YYYYMMDD')}.json`, JSON.stringify(songsData), null);
	systemLogger.info('Data Collected.');
}

export async function getComment(videoId: string) {
	systemLogger.info('Start get comment.');
	const commentData: {
		[videoId: string]: {
			comment: string,
			author: string,
			authorImage: string,
			date: string,
		}[]
	} = {};

	await youtube.commentThreads.list({
		part: ['snippet'],
		order: 'relevance',
		videoId: videoId,
	}).then((response) => {
		commentData[response.data.items![0].snippet?.videoId!] = response.data.items!.map((item) => {
			return {
				comment: item.snippet?.topLevelComment?.snippet?.textOriginal!,
				author: item.snippet?.topLevelComment?.snippet?.authorDisplayName!,
				authorImage: item.snippet?.topLevelComment?.snippet?.authorProfileImageUrl!,
				date: item.snippet?.topLevelComment?.snippet?.publishedAt!,
			};
		});
	}).catch((response) => {
		throw youtubeLogger.error(response);
	});
	return commentData;
}
