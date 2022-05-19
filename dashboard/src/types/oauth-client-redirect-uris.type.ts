export interface OauthClientRedirectUri {
    id: number;
    createdAt: Date;
    editedAt?: Date;
    uri: string;
    ownerId: number;
    oauthClientId: number;
}
