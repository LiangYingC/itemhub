export interface OauthClient {
    id: number;
    name: string;
    ownerId: number;
    clientId: string;
    hashClientSecrets: string;
}
