export interface TriggerOerator {
    key: 'B' | 'BE' | 'L' | 'LE' | 'E';
    value: 0 | 1 | 2 | 3 | 4;
    label: string;
}

export interface FirmwareType {
    key: 'PARTICLE_IO_PHOTON' | 'ARDUINO_NANO_33_IOT' | 'ESP_01S';
    value: 0 | 1 | 2;
    label: string;
}
