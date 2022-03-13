import {createSlice} from '@reduxjs/toolkit';

export const playerSlice = createSlice({
	name: 'player',
	initialState: {
		value: 'about:blank',
	},
	reducers: {
		setPlayer: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const {setPlayer} = playerSlice.actions;
export default playerSlice.reducer;
