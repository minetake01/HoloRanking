import {FormControl, Grid, Link, MenuItem, Select, Toolbar, Tooltip, Typography} from '@mui/material';
import {DataGrid, GridColDef, GridToolbar, jaJP} from '@mui/x-data-grid';
import React from 'react';
import ReactDOM from 'react-dom';
import {dataProcess, rowsType} from '../dataProcessing';

export const Main = () => {
	const [videoType, setVideoType] = React.useState<'Music_Cover' | 'Original'>('Music_Cover');
	const [period, setPeriod] = React.useState('weekly');
	const [rows, setRows] = React.useState<rowsType[]>([]);
	const [controlKey, setControlKey] = React.useState(false)

	document.onkeydown = event => {if (event.ctrlKey) setControlKey(true)}
	document.onkeyup = event => setControlKey(false)

	React.useEffect(() => {
		(async () => {
			setRows(await dataProcess(videoType, period));
		})();
	}, []);

	return (
		<Grid item xs={9} sx={{height: '100vh', paddingTop: '64px'}}>
			<Toolbar sx={{paddingRight: '0 !important'}}>

				<FormControl sx={{width: '100px'}}>
					<Select
						size='small'
						value={videoType}
						onChange={(event) => {
							setVideoType(event.target.value as 'Music_Cover' | 'Original');
						}}
					>
						<MenuItem value='Music_Cover'>歌みた</MenuItem>
						<MenuItem value='Original'>オリ曲</MenuItem>
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
				columns={[
					{
						field: 'rank',
						headerName: '順位',
						type: 'number',
						width: 70,
					},
					{
						field: 'lastRank',
						headerName: '前回',
						type: 'number',
						width: 70,
					},
					{
						field: 'fluctuation',
						headerName: '変動',
						type: 'number',
						width: 70,
					},
					{
						field: 'title',
						headerName: 'タイトル',
						width: 400,
						renderCell: (params) => {
							console.log(params)
							return <Tooltip title={params.formattedValue} disableInteractive>
								<div>
									{controlKey ? <Link href={params.row.url} underline='none' color='initial'>
										<div style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>
									</Link> : <div style={{cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>}
								</div>
							</Tooltip>
						}
					},
					{
						field: 'author',
						headerName: 'メンバー',
						width: 200,
						renderCell: (params) => {
							return <Tooltip title={params.formattedValue} disableInteractive>
								<div style={{cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>
							</Tooltip>
						}
					},
					{
						field: 'en_author',
						headerName: 'メンバー（英語表記）',
						width: 200,
						renderCell: (params) => {
							return <Tooltip title={params.formattedValue} disableInteractive>
								<div style={{cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>
							</Tooltip>
						}
					},
					{
						field: 'song',
						headerName: '楽曲',
						width: 200,
						renderCell: (params) => {
							return <Tooltip title={params.formattedValue} disableInteractive>
								<div style={{cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>
							</Tooltip>
						}
					},
					{
						field: 'artist',
						headerName: 'アーティスト',
						width: 150,
						renderCell: (params) => {
							return <Tooltip title={params.formattedValue} disableInteractive>
								<div style={{cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>
							</Tooltip>
						}
					},
					{
						field: 'date',
						headerName: '日付',
						type: 'date',
						width: 200,
					},
					{
						field: 'increment',
						headerName: '増加',
						type: 'number',
						width: 100,
					},
					{
						field: 'total',
						headerName: '合計',
						type: 'number',
						width: 100,
					},
					{
						field: 'url',
						headerName: 'URL',
						width: 300,
						renderCell: (params) => {
							return <Link href={params.value} target='_blank'>{params.value}</Link>;
						}
					},
				]}
				rows={rows}
				getRowId={(row) => row.rank}
				density='compact'
				disableColumnMenu
				disableSelectionOnClick
				disableVirtualization
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
