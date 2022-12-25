import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import getPost from './getPost';
 
export default configureStore({
    reducer: {
        user: userReducer, 
      // posts: getPost,
    },
});

