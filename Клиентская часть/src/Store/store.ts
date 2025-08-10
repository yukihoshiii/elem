import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/auth';
import uiReducer from './Slices/ui';
import musicPlayerReducer from './Slices/musicPlayer';
import imageViewReducer from './Slices/imageView';
import messengerReducer from './Slices/messenger';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    musicPlayer: musicPlayerReducer,
    imageView: imageViewReducer,
    messenger: messengerReducer
  },
});

export default store;