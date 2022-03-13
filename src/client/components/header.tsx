import {AppBar, Box, Toolbar, Typography} from '@mui/material';
import React from 'react';

import {theme} from '../palette';

export const Header = () => {
	return (
		<Box sx={{flexGrow: 1, zIndex: 1}}>
			<AppBar
				position='absolute'
				sx={{
					backgroundColor: theme.palette.primary.main,
				}}
			>
				<Toolbar>
					<Typography
						variant='h5'
						component="div"
						sx={{flexGrow: 1, userSelect: 'none'}}
					>
						HoloRanking
					</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
