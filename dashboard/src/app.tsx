import './app.css';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectDevices } from './redux/reducers/device.reducer';
import { add, addMany } from './redux/reducers/device.reducer';
import { useContext, useEffect } from 'react';
import { AuthDataservice } from './dataservices/auth.dataservice';
import { CookieHelper } from './helpers/cookie.helper';
import { LogContext } from './contexts/logs.context';

function App() {
    const dispatch = useDispatch();
    const devices = useSelector(selectDevices);
    const { logs, addLog } = useContext(LogContext);
    return (
        <div>
            <button onClick={() => addLog('testing')}>Add Logs</button>

            <div>
                {logs.map((item) => (
                    <div>{item}</div>
                ))}
            </div>

            {/* <div>
                <button
                    aria-label="Increment value"
                    onClick={() => dispatch(increment())}
                >
                    +
                </button>
                <span>{count}</span>
                <button
                    aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}
                >
                    -
                </button>
            </div> */}

            <div>
                {/* <button onClick={() => dispatch(add())}>add</button>
                <button
                    onClick={() =>
                        dispatch(addMany([{ name: '2' }, { name: '3' }]))
                    }
                >
                    addMany
                </button> */}
                {devices.map((item) => (
                    <div>{item.name}</div>
                ))}
            </div>
            <Outlet />
        </div>
    );
}

export default App;
