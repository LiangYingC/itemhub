import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DevicePinData from './device-pin-data';

describe('<DevicePinData />', () => {
    test('it should mount', () => {
        render(<DevicePinData />);

        const devicePinData = screen.getByTestId('DevicePinData');

        expect(devicePinData).toBeInTheDocument();
    });
});
