import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TariffProvider } from '@/context/TariffContext';
import { BlogProvider } from '@/context/BlogContext';
import { GalleryProvider } from '@/context/GalleryContext';
import { HomeProvider } from '@/context/HomeContext'; // <--- Impor di sini
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TariffProvider>
        <BlogProvider>
          <GalleryProvider>
            <HomeProvider> {/* <--- Bungkus di sini */}
              <App />
            </HomeProvider>
          </GalleryProvider>
        </BlogProvider>
      </TariffProvider>
    </BrowserRouter>
  </React.StrictMode>
);
