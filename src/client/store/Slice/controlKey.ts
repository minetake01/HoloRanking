import {createSlice} from '@reduxjs/toolkit';

export const controlKeySlice = createSlice({
	name: 'controlKey',
	initialState: {
		state: false,
	},
	reducers: {
		setControlKey: (state, action) => {
			state.state = action.payload;
		},
	},
});

export const {setControlKey} = controlKeySlice.actions;
export default controlKeySlice.reducer;
