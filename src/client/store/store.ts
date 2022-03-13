import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {useSelector as rawUseSelector, TypedUseSelectorHook} from 'react-redux';

import commentReducer from './Slice/comment';
import controlKeyReducer from './Slice/controlKey';
import periodReducer from './Slice/period';
import playerReducer from './Slice/player';
import rowsReducer from './Slice/rows';
import videoTypeReducer from './Slice/videoType';

export const store = configureStore({
	reducer: {
		controlKey: controlKeyReducer,
		videoType: videoTypeReducer,
		period: periodReducer,
		rows: rowsReducer,
		player: playerReducer,
		comment: commentReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
