import * as fs from 'fs';
import {HolodexApiClient, SortOrder, VideoStatus} from 'holodex.js';
import {holodexApiKey, youtubeApiKey} from './apiKey';
import {google} from 'googleapis';

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
	// データ読み込み
	const previousDate = new Date();
	previousDate.setDate(previousDate.getDate() - 1);
	songsData = JSON.parse(await fs.promises.readFile(`./songsData/${previousDate.getFullYear()}${previousDate.getMonth()+1}${previousDate.getDate()}.json`, 'utf-8'));
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
		}),
		holodex.getVideos({
			topic: 'Original_Song',
			status: VideoStatus.Past,
			include: 'mentions,songs',
			sort: 'published_at',
			limit: 50,
			org: 'Hololive',
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
		});
	}
	const date = new Date();
	fs.writeFileSync(`./songsData/${date.getFullYear()}${date.getMonth()+1}${date.getDate()}.json`, JSON.stringify(songsData), null);
}
