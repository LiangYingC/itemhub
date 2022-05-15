export interface TriggerOerator {
    key: 'B' | 'BE' | 'L' | 'LE' | 'E';
    value: 0 | 1 | 2 | 3 | 4;
    label: string;
    symbol?: '>' | '>=' | '<' | '<=' | '=' | null;
}

export interface Microcontroller {
    key: string;
    value: number;
    label: string;
}
