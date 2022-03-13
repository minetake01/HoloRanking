import * as fs from 'fs';

import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import ytdl from 'ytdl-core';

ffmpeg.setFfmpegPath(ffmpegPath.path);

export function videoDownloader(videourl: string[]) {
	videourl.forEach((url, index) => {
		const audioOutput = `./tmp/${index}_sound.mp4`;
		const videoOutput = `./tmp/${index}_video.mp4`;
		const mainOutput = `./tmp/${index}.mp4`;

		ytdl(url, {quality: 'highestvideo', filter: (format) => format.container === 'mp4'})
			.pipe(fs.createWriteStream(videoOutput))
			.on('finish', () => {
				ytdl(url, {quality: 'highestaudio', filter: (format) => format.container === 'mp4'})
					.pipe(fs.createWriteStream(audioOutput))
					.on('finish', () => {
						ffmpeg().input(videoOutput).videoCodec('copy')
							.input(audioOutput).audioCodec('copy')
							.save(mainOutput)
							.on('end', () => {
								fs.unlink(audioOutput, () => {});
								fs.unlink(videoOutput, () => {});
							});
					});
			});
	});
}
