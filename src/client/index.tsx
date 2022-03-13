import {Grid} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {DownloadList} from './components/download';
import {Header} from './components/header';
import {Main} from './components/main';
import {Player} from './components/player';
import {store} from './store/store';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Header />
			<Grid container columnSpacing={2}>
				<Main />
				<Grid item xs={3}>
					<div style={{
						display: 'flex',
						flexFlow: 'column',
						height: 'calc(100vh - 64px)',
						paddingTop: '64px',
					}}>
						<Player />
						<DownloadList />
					</div>
				</Grid>
			</Grid>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root'),
);
