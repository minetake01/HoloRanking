import {Avatar, Box, Paper, Stack, Toolbar, Typography} from '@mui/material';
import axios from 'axios';
import React from 'react';
import {useDispatch} from 'react-redux';

import {setComment} from '../store/Slice/comment';
import {useSelector} from '../store/store';

type commentData = {
	[videoId: string]: {
		comment: string,
		author: string,
		authorImage: string,
		date: string
	}[]
}

export function Player() {
	const player = useSelector((state) => state.player.value);
	const comment = useSelector((state) => state.comment.value);
	const dispatch = useDispatch();

	const videoId = player.replace('https://www.youtube.com/watch?v=', '');

	React.useEffect(() => {
		if (videoId !== 'about:blank') {
			axios.get<commentData>(`http://${location.host}/HoloRanking/api/comment?videoid=${videoId}`)
				.then((response) => {
					dispatch(setComment(response.data[videoId]));
				}).catch(e => {
					console.log(e)
				})
		}
	}, [player]);
	return (
		<Paper style={{height: 'calc((25vw - 16px) * 0.5625)', overflow: 'auto'}}>
			<Box sx={{height: 'calc((25vw - 16px) * 0.5625)', width: '100%'}}>
				<iframe
					width="560"
					height="315"
					src={videoId === 'about:blank' ? videoId : `https://www.youtube.com/embed/${videoId}?modestbranding=1`}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					style={{height: '100%', width: '100%'}}
				/>
			</Box>
			<Box>
				<Toolbar>
					<Typography
						variant='h6'
						component="div"
						sx={{flexGrow: 1, userSelect: 'none'}}
					>
						コメント
					</Typography>
				</Toolbar>
				<Stack spacing={3} sx={{paddingRight: '24px', paddingLeft: '24px'}}>
					{
						comment.map((item, index) => {
							const date = new Date();
							const publishedDate = new Date(item.date)
							const diffDay = Math.floor((date.getTime() - publishedDate.getTime()) / 1000 / 60 / 60 / 24)
							const ago = () => {
								if (diffDay < 8) {
									return `${diffDay}日前`
								} else if (diffDay < 22) {
									return `${Math.floor(diffDay / 7)}週間前`
								} else if (diffDay < 365) {
									return `${Math.floor(diffDay / 22)}ヶ月前`
								} else {
									return `${Math.floor(diffDay / 365)}年前`
								}
							}
							return (
								<Stack key={index} spacing={2} direction='row'>
									<Stack spacing={1} sx={{width: '36px', alignItems: 'center'}}>
										<Avatar
											src={item.authorImage}
											sx={{width: 36, height: 36}}
										/>
										<Typography
											style={{
												fontSize: '12px',
												wordBreak: 'keep-all',
												userSelect: 'none',
												color: 'GrayText'
											}}
										>
											{ago()}
										</Typography>
									</Stack>
									<Stack spacing={0.5}>
										<Typography
											style={{
												textOverflow: 'ellipsis',
												fontSize: '14px',
												userSelect: 'none',
												color: 'GrayText'
											}}
										>
											{item.author}
										</Typography>
										<Typography
											style={{
												fontSize: '14px'
											}}
										>
											{item.comment}
										</Typography>
									</Stack>
								</Stack>
							)
						})
					}
				</Stack>
			</Box>
		</Paper>
	);
}
