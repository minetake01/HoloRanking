import {createSlice} from '@reduxjs/toolkit';

export const downloadSlice = createSlice({
	name: 'download',
	initialState: {
		value: [] as string[],
	},
	reducers: {
		setDownload: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const {setDownload} = downloadSlice.actions;
export default downloadSlice.reducer;
