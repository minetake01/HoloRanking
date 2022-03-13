import {createSlice} from '@reduxjs/toolkit';

export const periodSlice = createSlice({
	name: 'period',
	initialState: {
		value: 'weekly' as 'weekly' | 'monthly',
	},
	reducers: {
		setPeriod: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const {setPeriod} = periodSlice.actions;
export default periodSlice.reducer;
