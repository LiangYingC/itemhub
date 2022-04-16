import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PageTitle from './page-title';

describe('<Pagination />', () => {
    test('it should mount', () => {
        render(<PageTitle title="" />);

        const pageTitle = screen.getByTestId('PageTitle');

        expect(pageTitle).toBeInTheDocument();
    });
});
