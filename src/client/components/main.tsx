import {Download} from '@mui/icons-material';
import {FormControl, Grid, IconButton, MenuItem, Select, Toolbar, Tooltip} from '@mui/material';
import {DataGrid, GridColDef, GridToolbar, jaJP} from '@mui/x-data-grid';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';

const columns: GridColDef[] = [
	{
		field: 'rank',
		headerName: '順位',
		width: 90,
	},
	{
		field: 'lastRank',
		headerName: '前回順位',
		width: 90,
	},
	{
		field: 'fluctuation',
		headerName: '変動',
		width: 90,
	},
	{
		field: 'title',
		headerName: 'タイトル',
		width: 300,
	},
	{
		field: 'author',
		headerName: 'メンバー',
		width: 150,
	},
	{
		field: 'date',
		headerName: '日付',
		width: 150,
	},
	{
		field: 'increment',
		headerName: '増加',
		type: 'number',
		width: 90,
	},
	{
		field: 'total',
		headerName: '合計',
		type: 'number',
		width: 90,
	},
	{
		field: 'url',
		headerName: 'URL',
		width: 250,
	},
];

let songsData: {
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
} = {
	Music_Cover: [],
	Original: [],
};

export const Main = () => {
	const [videoType, setVideoType] = React.useState('music_cover');
	const [period, setPeriod] = React.useState('weekly');

	axios.get(`http://${location.host}/api/songsdata?period=${period}`)
		.then((response) => {
			songsData = JSON.parse(response.data);
		});

	return (
		<Grid item xs={9} sx={{height: '100vh', paddingTop: '64px'}}>
			<Toolbar sx={{paddingRight: '0 !important'}}>

				<FormControl sx={{width: '100px'}}>
					<Select
						size='small'
						value={videoType}
						onChange={(event) => {
							setVideoType(event.target.value);
						}}
					>
						<MenuItem value='music_cover'>歌みた</MenuItem>
						<MenuItem value='original'>オリ曲</MenuItem>
					</Select>
				</FormControl>

				<FormControl sx={{paddingLeft: 2, width: '100px'}}>
					<Select
						size='small'
						value={period}
						onChange={(event) => {
							setPeriod(event.target.value);
						}}
					>
						<MenuItem value='weekly'>週間</MenuItem>
						<MenuItem value='monthly'>月間</MenuItem>
					</Select>
				</FormControl>
			</Toolbar>
			<DataGrid
				sx={{
					height: 'calc(100% - 76px)',
					marginLeft: '16px',
				}}
				columns={columns}
				rows={[]}
				checkboxSelection
				components={{
					Toolbar: GridToolbar,
				}}
				localeText={
					jaJP.components.MuiDataGrid.defaultProps.localeText
				}
			/>
		</Grid>
	);
};
