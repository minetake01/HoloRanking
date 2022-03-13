import {createSlice} from '@reduxjs/toolkit';

import {rowsType} from '../../dataProcessing';

export const rowsSlice = createSlice({
	name: 'rows',
	initialState: {
		value: [] as rowsType[],
	},
	reducers: {
		setRows: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const {setRows} = rowsSlice.actions;
export default rowsSlice.reducer;
