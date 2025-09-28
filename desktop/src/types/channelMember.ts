export interface ChannelMember {
    id: number;            // Уникальный идентификатор участника канала
    channelId: number;     // Идентификатор канала
    userId: number;        // Идентификатор пользователя
    role: string;          // Роль участника в канале (например, 'admin', 'member')
}
