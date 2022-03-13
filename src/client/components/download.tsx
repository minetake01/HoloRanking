import {Download} from '@mui/icons-material';
import {Fab, Box, List, Paper, Toolbar, Tooltip, Typography, ListItem, ListItemText, Stack, CircularProgress} from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useSelector } from '../store/store';

export const DownloadList = () => {
	const rows = useSelector((state) => state.rows.value);
	const download = useSelector((state) => state.download.value);
	return (
		<Paper elevation={4} sx={{height: 'calc(100% - (25vw - 16px) * 0.5625)', zIndex: 1}}>
			<Toolbar>
				<Typography
					variant='h6'
					sx={{flexGrow: 1, userSelect: 'none'}}
				>
					Download List
				</Typography>
			</Toolbar>
			<List
				sx={{
					height: 'calc(100% - 166px)',
					backgroundColor: 'whitesmoke',
					overflow: 'auto',
					overflowX: 'auto'
				}}
			>
				{
					download.map((item, index) => {
						return (
							<ListItem key={index} sx={{userSelect: 'none'}}>
								<Typography sx={{whiteSpace: 'nowrap'}}>
									{rows.find(value => value.url === item)?.title}
								</Typography>
							</ListItem>
						)
					})
				}
			</List>
			<Box sx={{margin: 2, marginLeft: 'auto', width: '56px', display: 'flex', position: 'relative'}}>
				<Tooltip title='ダウンロード'>
					<Fab
						size='large'
						color="primary"
						onClick={event => {
							axios.get(`http://${location.host}/HoloRanking/api/download?videoid=${download}`)
						}}
					>
						<Download />
					</Fab>
				</Tooltip>
			</Box>
		</Paper>
	);
};
