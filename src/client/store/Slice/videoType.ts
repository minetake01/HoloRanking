import {createSlice} from '@reduxjs/toolkit';

export const videoTypeSlice = createSlice({
	name: 'videoType',
	initialState: {
		value: 'Music_Cover' as 'Music_Cover' | 'Original',
	},
	reducers: {
		setVideoType: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const {setVideoType} = videoTypeSlice.actions;
export default videoTypeSlice.reducer;
