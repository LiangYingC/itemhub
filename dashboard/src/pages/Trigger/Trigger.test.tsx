import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Trigger from './Trigger';

describe('<Trigger />', () => {
    test('it should mount', () => {
        render(<Trigger />);

        const trigger = screen.getByTestId('Trigger');

        expect(trigger).toBeInTheDocument();
    });
});
