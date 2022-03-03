import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Pagination from './pagination';

describe('<Pagination />', () => {
    test('it should mount', () => {
        render(<Pagination rowNums={100} limit={5} page={1} />);

        const pagination = screen.getByTestId('Pagination');

        expect(pagination).toBeInTheDocument();
    });
});
