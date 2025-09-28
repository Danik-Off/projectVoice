export type User = {
    id: number;
    username: string;
    email: string;
    role?: string;
    isActive?: boolean;
    profilePicture?: string;
    status?: string;
    tag?: string;
    createdAt?: string;
    blockedAt?: string;
    blockedBy?: string;
    blockReason?: string;
};
