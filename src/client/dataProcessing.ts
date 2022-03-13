import axios from 'axios';
import dayjs from 'dayjs';

export type rowsType = {
	rank: number | string,
	lastRank: number | string,
	fluctuation: string,
	title: string,
	author: string,
	en_author: string | undefined,
	song: string,
	artist: string,
	date: string,
	increment: number,
	total: number,
	url: string,
};

type SongsData = {
	Music_Cover: {
		videoId: string,
		title: string,
		song: string[],
		artist: string[],
		author: string[],
		en_author: (string | undefined)[],
		date: Date | undefined,
		total: number,
	}[],
	Original: {
		videoId: string,
		title: string,
		song: string[],
		artist: string[],
		author: string[],
		en_author: (string | undefined)[],
		date: Date | undefined,
		total: number,
	}[],
}

export async function dataProcess(videoType: 'Music_Cover' | 'Original', period: string): Promise<rowsType[]> {
	let songsData: SongsData[] = [{
		Music_Cover: [{
			videoId: '',
			title: '',
			song: [''],
			artist: [''],
			author: [''],
			en_author: [''],
			date: undefined,
			total: NaN,
		}],
		Original: [{
			videoId: '',
			title: '',
			song: [''],
			artist: [''],
			author: [''],
			en_author: [''],
			date: undefined,
			total: NaN,
		}],
	}];
	songsData = await (await axios.get(`http://${location.host}/HoloRanking/api/songsdata?period=${period}`)).data;
	const prevRows = songsData[1][videoType].map((item) => {
		const prevItem = songsData[2][videoType].find((value) => value.videoId === item.videoId);
		return {
			rank: prevItem ? NaN : 'NEW',
			increment: prevItem ? item.total - prevItem!.total: item.total,
			total: item.total,
			videoId: item.videoId,
		};
	});
	prevRows.sort((a, b) => {
		return (a.rank === 'NEW' ? 0 : b.increment as number + 1) - (b.rank === 'NEW' ? 0 : a.increment as number + 1);
	});
	let prevIndex = 1;
	prevRows.forEach((item) => {
		if (item.rank !== 'NEW') item.rank = prevIndex++;
	});

	const rows = songsData[0][videoType].map((item) => {
		const prevItem = prevRows.find((value) => value.videoId === item.videoId);
		return {
			rank: prevItem ? NaN : 'NEW',
			lastRank: prevItem ? prevItem!.rank : '-',
			fluctuation: '-',
			title: item.title,
			author: item.author.join(),
			en_author: item.en_author.join(),
			song: item.song.join(),
			artist: item.artist.join(),
			date: dayjs(item.date).format('YYYY/MM/DD'),
			increment: prevItem ? item.total - prevItem!.total : item.total,
			total: item.total,
			url: `https://www.youtube.com/watch?v=${item.videoId}`,
		};
	});
	rows.sort((a, b) => {
		return (a.rank === 'NEW' ? 0 : b.increment as number + 1) - (b.rank === 'NEW' ? 0 : a.increment as number + 1);
	});
	let index = 1;
	rows.forEach((item) => {
		if (item.rank !== 'NEW') item.rank = index++;
		if (Number.isFinite(item.rank) && Number.isFinite(item.lastRank)) {
			const fluctuation = (item.lastRank as number) - (item.rank as number);
			switch (Math.sign(fluctuation)) {
			case -1:
				item.fluctuation = `${fluctuation}`;
				break;
			case 0:
				item.fluctuation = `±${fluctuation}`;
				break;
			case 1:
				item.fluctuation = `+${fluctuation}`;
			}
		}
	});
	return rows;
}
