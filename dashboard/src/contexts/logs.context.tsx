import { FC } from 'react';
import { useState, createContext } from 'react';
import { LogsContextState } from '../types/logs.type';

const contextDefaultValues: LogsContextState = {
    logs: [],
    addLog: () => {},
};

export const LogContext = createContext(contextDefaultValues);

const LogProvider: FC = ({ children }) => {
    const [logs, setLogs] = useState<string[]>(contextDefaultValues.logs);
    const addLog = (newLog: string) => setLogs((logs) => [...logs, newLog]);

    return (
        <LogContext.Provider value={{ logs, addLog }}>
            {children}
        </LogContext.Provider>
    );
};

export default LogProvider;
