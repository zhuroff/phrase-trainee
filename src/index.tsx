import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { LayoutSwitcherProvider } from './hooks/useLayoutSwitcher';
import 'primereact/resources/themes/lara-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LayoutSwitcherProvider>
      <App />
    </LayoutSwitcherProvider>
  </React.StrictMode>
);
