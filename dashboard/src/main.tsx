import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Devices from './pages/Devices/Devices';
import Device from './pages/Device/Device';
import DevicePinData from './pages/DevicePinData/DevicePinData';
import NotFound from './pages/NotFound/NotFound';
import Triggers from './pages/Triggers/Triggers';
import Trigger from './pages/Trigger/Trigger';
import OauthClients from './pages/OauthClients/OauthClients';
import { Provider } from 'react-redux';
import store from './redux/store';
import LogProvider from './contexts/logs.context';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route
                path=""
                element={
                    <LogProvider>
                        <Provider store={store}>
                            <App />
                        </Provider>
                    </LogProvider>
                }
            >
                <Route path="/" element={<Dashboard />}>
                    <Route path="devices" element={<Devices />} />
                    <Route path="devices/:id" element={<Device />} />
                    <Route
                        path="devices/:id/:pin"
                        element={<DevicePinData />}
                    />
                    <Route path="triggers" element={<Triggers />} />
                    <Route path="triggers/:id" element={<Trigger />} />
                    <Route path="oauth-clients" element={<OauthClients />} />
                </Route>
                <Route path="/404" element={<NotFound />} />
            </Route>
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);
