import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NotFound from './not-found';

describe('<NotFound />', () => {
    test('it should mount', () => {
        render(<NotFound />);

        const notFound = screen.getByTestId('NotFound');

        expect(notFound).toBeInTheDocument();
    });
});
