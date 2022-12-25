import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = "http://3.236.144.208:80";

const intitialState = {
	status: 'idle',
	data: []
};


export const retrieve = createAsyncThunk('posts/retrieve', async (statID) => {
	// CHANGE
	const response = await axios.get(`${URL}/feed/${statID}`);
	return response;
});

export const getPost = createSlice({
	name:'posts', 
	intitialState,
	reducers: {
		addPost: (state, action) => {
			state.data.push(action.payload);
		},
	},
	additional (build) {
		build
		.addCase(retrieve.pending, (state) => {
			state.status = 'loading';
		})
		.addCase(retrieve.fulfilled, (state, action) => {
			state.status = 'success';
			state.data = action.payload;
		})
		.addCase(retrieve.rejected, (state) => {
			
			state.status = 'failure';
		});
	},
	
});
export const { addPost } = getPost.actions;
export default getPost.reducer;