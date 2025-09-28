export interface Channel {
    id: number;            // Уникальный идентификатор канала
    serverId: number;      // Идентификатор сервера, к которому принадлежит канал
    name: string;          // Название канала
    type: 'text' | 'voice'; // Тип канала (текстовый или голосовой)
    description?: string;  // Описание канала (необязательное поле)
}
