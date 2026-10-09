import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { TariffProvider } from '@/context/TariffContext';
import { BlogProvider } from '@/context/BlogContext';
import { GalleryProvider } from '@/context/GalleryContext';
import { HomeProvider } from '@/context/HomeContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TariffProvider>
          <BlogProvider>
            <GalleryProvider>
              <HomeProvider>
                <App />
              </HomeProvider>
            </GalleryProvider>
          </BlogProvider>
        </TariffProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
