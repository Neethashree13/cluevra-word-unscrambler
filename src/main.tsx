import {StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import {getRouteFromPath} from './lib/router.ts';
import './index.css';

if (getRouteFromPath(window.location.pathname) !== 'notFound') {
  hydrateRoot(document.getElementById('root')!,
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
