import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OauthClients from './oauth-clients';

describe('<OauthClients />', () => {
    test('it should mount', () => {
        render(<OauthClients />);

        const oauthClients = screen.getByTestId('OauthClients');

        expect(oauthClients).toBeInTheDocument();
    });
});
