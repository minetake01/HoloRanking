import {Launch} from '@mui/icons-material';
import {Alert, FormControl, Grid, IconButton, Link, MenuItem, Select, Toolbar, Tooltip} from '@mui/material';
import {DataGrid, GridComparatorFn, GridToolbar, jaJP} from '@mui/x-data-grid';
import React from 'react';
import {useDispatch} from 'react-redux';

import {dataProcess} from '../dataProcessing';
import {setControlKey} from '../store/Slice/controlKey';
import { setDownload } from '../store/Slice/download';
import {setPeriod} from '../store/Slice/period';
import {setPlayer} from '../store/Slice/player';
import {setRows} from '../store/Slice/rows';
import {setVideoType} from '../store/Slice/videoType';
import {useSelector} from '../store/store';

export const Main = () => {
	const videoType = useSelector((state) => state.videoType.value);
	const period = useSelector((state) => state.period.value);
	const rows = useSelector((state) => state.rows.value);
	const download = useSelector((state) => state.download.value);
	const controlKey = useSelector((state) => state.controlKey.state);
	const dispatch = useDispatch();

	document.onkeydown = (event) => {
		if (event.ctrlKey) dispatch(setControlKey(true));
	};
	document.onkeyup = (_) => dispatch(setControlKey(false));

	React.useEffect(() => {
		dispatch(setRows([]));
		dataProcess(videoType, period)
			.then((value) => {
				dispatch(setRows(value));
			});
	}, [videoType, period]);

	const rankSortComparator: GridComparatorFn = (a, b) => {
		return (typeof b === 'string' ? 0 : (b as number)) - (typeof a === 'string' ? 0 : (a as number));
	};
	const fluctuationSortComparator: GridComparatorFn = (a, b) => {
		return +((b as string).replace(/±|-+$/, ''))! - +((a as string).replace(/±|-+$/, ''))!;
	};
	const dateSortComparator: GridComparatorFn = (a, b) => {
		return +(a as string).replace(/\//g, '') - +(b as string).replace(/\//g, '')
	}

	return (
		<Grid item xs={9} sx={{height: '100vh', paddingTop: '64px'}}>
			<Toolbar sx={{paddingRight: '0 !important'}}>

				<FormControl sx={{width: '100px'}}>
					<Select
						size='small'
						value={videoType}
						onChange={(event) => {
							dispatch(setVideoType(event.target.value as 'Music_Cover' | 'Original'));
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
							dispatch(setPeriod(event.target.value));
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
						sortComparator: rankSortComparator,
					},
					{
						field: 'lastRank',
						headerName: '前回',
						type: 'number',
						width: 70,
						sortComparator: rankSortComparator,
					},
					{
						field: 'fluctuation',
						headerName: '変動',
						type: 'number',
						width: 70,
						sortComparator: fluctuationSortComparator,
					},
					{
						field: 'title',
						headerName: 'タイトル',
						width: 400,
						renderCell: (params) => {
							return (
								<div style={{maxWidth: 'calc(100% - 36px)', display: 'flex', alignItems: 'center'}}>
									<Tooltip title={params.formattedValue} disableInteractive>
										<div style={{maxWidth: '100%'}}>
											{controlKey ?
												<Link href={params.row.url} underline='none' color='initial' rel='noopener'>
													<div style={{cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>
												</Link> :
												<div style={{cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>}
										</div>
									</Tooltip>
									<Tooltip title="埋め込みプレーヤーで再生" disableInteractive>
										<IconButton
											size='small'
											onClick={() => {
												dispatch(setPlayer(params.row.url));
											}}
										>
											<Launch fontSize='small' />
										</IconButton>
									</Tooltip>
								</div>
							);
						},
					},
					{
						field: 'author',
						headerName: 'メンバー',
						width: 200,
						renderCell: (params) => {
							return <Tooltip title={params.formattedValue} disableInteractive>
								<div style={{cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>
							</Tooltip>;
						},
					},
					{
						field: 'en_author',
						headerName: 'メンバー（英語表記）',
						width: 200,
						renderCell: (params) => {
							return <Tooltip title={params.formattedValue} disableInteractive>
								<div style={{cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>
							</Tooltip>;
						},
					},
					{
						field: 'song',
						headerName: '楽曲',
						width: 200,
						renderCell: (params) => {
							return <Tooltip title={params.formattedValue} disableInteractive>
								<div style={{cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>
							</Tooltip>;
						},
					},
					{
						field: 'artist',
						headerName: 'アーティスト',
						width: 150,
						renderCell: (params) => {
							return <Tooltip title={params.formattedValue} disableInteractive>
								<div style={{cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.formattedValue}</div>
							</Tooltip>;
						},
					},
					{
						field: 'date',
						headerName: '日付',
						type: 'number',
						width: 100,
						sortComparator: dateSortComparator,
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
						},
					},
				]}
				rows={rows}
				getRowId={(row) => row.url}
				density='compact'
				disableColumnMenu
				disableSelectionOnClick
				disableVirtualization
				checkboxSelection
				onSelectionModelChange={((selectionModel) => {
					if (selectionModel.length > 50) selectionModel.length = 50
					dispatch(setDownload(selectionModel))
				})}
				selectionModel={download}
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
