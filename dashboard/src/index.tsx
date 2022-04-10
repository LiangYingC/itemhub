import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import Devices from './pages/devices/devices';
import Device from './pages/device/device';
import DevicePinData from './pages/device-pin-data/device-pin-data';
import NotFound from './pages/not-found/not-found';
import Triggers from './pages/triggers/triggers';
import Trigger from './pages/trigger/trigger';
import OauthClients from './pages/oauth-clients/oauth-clients';
import { Provider } from 'react-redux';
import store from './redux/store';
import OauthClient from './pages/oauth-client/oauth-client';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route
                path=""
                element={
                    <Provider store={store}>
                        <App />
                    </Provider>
                }
            >
                <Route path="dashboard" element={<Dashboard />}>
                    <Route path="devices" element={<Devices />} />
                    <Route path="devices/:id" element={<Device />} />
                    <Route
                        path="devices/:id/:pin"
                        element={<DevicePinData />}
                    />
                    <Route path="triggers" element={<Triggers />} />
                    <Route path="triggers/create" element={<Trigger />} />
                    <Route path="triggers/:id" element={<Trigger />} />
                    <Route path="oauth-clients" element={<OauthClients />} />
                    <Route
                        path="oauth-clients/create"
                        element={<OauthClient />}
                    />
                    <Route path="oauth-clients/:id" element={<OauthClient />} />
                </Route>
                <Route path="/404" element={<NotFound />} />
            </Route>
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);
