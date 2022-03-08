import {Grid} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import {DownloadList} from './components/download';
import {Header} from './components/header';
import {Main} from './components/main';

ReactDOM.render(
	<React.StrictMode>
    	<Header />
		<Grid container columnSpacing={2}>
			<Main />
			<DownloadList />
		</Grid>
	</React.StrictMode>,
	document.getElementById('root'),
);