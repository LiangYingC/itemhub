import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Trigger from './trigger';

describe('<Trigger />', () => {
    test('it should mount', () => {
        render(<Trigger />);

        const trigger = screen.getByTestId('Trigger');

        expect(trigger).toBeInTheDocument();
    });
});
