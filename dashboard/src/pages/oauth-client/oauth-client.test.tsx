import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OauthClient from './oauth-client';

describe('<OauthClient />', () => {
    test('it should mount', () => {
        render(<OauthClient />);

        const oauthClient = screen.getByTestId('OauthClient');

        expect(oauthClient).toBeInTheDocument();
    });
});
