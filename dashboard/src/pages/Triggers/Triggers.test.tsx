import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Triggers from './triggers';

describe('<Triggers />', () => {
    test('it should mount', () => {
        render(<Triggers />);

        const triggers = screen.getByTestId('Triggers');

        expect(triggers).toBeInTheDocument();
    });
});
