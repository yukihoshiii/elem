import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { DynamicIslandProvider, DynamicIsland } from './System/Context/DynamicIsland';
import { Modal } from './System/Elements/Modal';
import { ModalProvider } from './System/Context/Modal';
import { WebSocketProvider } from './System/Context/WebSocket';
import { PostModalProvider } from './System/Context/PostModal';
import store from './Store/store';
import AudioPlayer from './Components/AudioPlayer';
import ImageView from './Components/ImageView';
import { DatabaseProvider } from './System/Context/Database';
import Notifications from './Components/Notifications';
import ErrorBoundary from './System/Components/ErrorBoundary';

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DatabaseProvider>
        <Provider store={store}>
          <BrowserRouter>
            <DynamicIslandProvider>
              <WebSocketProvider>
                <ModalProvider>
                  <PostModalProvider>
                    <DynamicIsland />
                    <App />
                    <Modal />
                    <AudioPlayer />
                    <ImageView />
                    <Notifications />
                  </PostModalProvider>
                </ModalProvider>
              </WebSocketProvider>
            </DynamicIslandProvider>
          </BrowserRouter>
        </Provider>
      </DatabaseProvider>
    </ErrorBoundary>
  </React.StrictMode>
);