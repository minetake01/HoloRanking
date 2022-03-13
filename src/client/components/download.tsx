import {Download} from '@mui/icons-material';
import {Fab, Box, List, Paper, Toolbar, Tooltip, Typography} from '@mui/material';
import React from 'react';

export const DownloadList = () => {
	return (
		<Paper elevation={4} sx={{height: 'calc(100% - (25vw - 16px) * 0.5625)', zIndex: 1}}>
			<Toolbar>
				<Typography
					variant='h6'
					component="div"
					sx={{flexGrow: 1, userSelect: 'none'}}
				>
					Download List
				</Typography>
			</Toolbar>
			<List
				sx={{
					height: 'calc(100% - 166px)',
					backgroundColor: 'whitesmoke',
				}}
			>
			</List>
			<Box sx={{margin: 2, marginLeft: 'auto', width: '56px', position: 'relative'}}>
				<Tooltip title='ダウンロード'>
					<Fab
						size='large'
						color="primary"
					>
						<Download />
					</Fab>
				</Tooltip>
			</Box>
		</Paper>
	);
};
