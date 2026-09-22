import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import store from './redux/store.js';
import App from './App.jsx';
import './index.css'
import './i18n.jsx';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <App />
        </BrowserRouter>
    </Provider>
);
