import React, { FC, useState } from 'react';
import { LogsContextState } from '../types/logs.type';

const contextDefaultValues: LogsContextState = {
    logs: [],
    addLog: () => {},
};

export const LogContext = React.createContext(contextDefaultValues);

const LogProvider: React.FC = ({ children }) => {
    const [logs, setLogs] = useState<string[]>(contextDefaultValues.logs);
    const addLog = (newLog: string) => setLogs((logs) => [...logs, newLog]);
    return (
        <LogContext.Provider value={{ logs, addLog }}>
            {children}
        </LogContext.Provider>
    );
};

export default LogProvider;
