import { createSlice } from '@reduxjs/toolkit';
 
export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    affiliation: '',
    birthday: '',
    interests: '',
    email: '',
 
  },
  reducers: {
    login: (state, action) => {
    state.followerCount = action.payload.followerCount;
      state.followingCount = action.payload.followingCount;
      state.id = action.payload.id;
      state.username = action.payload.username;
    },
    logout: (state) => {
    state.followerCount = '';
      state.followingCount = '';
      state.username = '';
    },
  },
});
 
export const { login, logout } = UserSlice.actions;
 
export default UserSlice.reducer;
 
 
 
 

