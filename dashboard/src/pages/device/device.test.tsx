import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Device from './device';

describe('<Device />', () => {
    test('it should mount', () => {
        render(<Device />);

        const device = screen.getByTestId('Device');

        expect(device).toBeInTheDocument();
    });
});
