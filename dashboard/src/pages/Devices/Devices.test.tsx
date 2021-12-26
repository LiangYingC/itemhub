import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Devices from './Devices';

describe('<Devices />', () => {
    test('it should mount', () => {
        render(<Devices />);

        const devices = screen.getByTestId('Devices');

        expect(devices).toBeInTheDocument();
    });
});
