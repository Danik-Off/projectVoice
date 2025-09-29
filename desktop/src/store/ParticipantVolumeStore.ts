import { makeAutoObservable } from 'mobx';

class ParticipantVolumeStore {
    // Храним громкость для каждого участника по socketId
    private participantVolumes: Map<string, number> = new Map();

    public constructor() {
        makeAutoObservable(this);
    }

    // Получить громкость участника (по умолчанию 100%)
    public getParticipantVolume(socketId: string): number {
        return this.participantVolumes.get(socketId) ?? 100;
    }

    // Установить громкость участника
    public setParticipantVolume(socketId: string, volume: number): void {
        this.participantVolumes.set(socketId, Math.max(0, Math.min(100, volume)));
    }

    // Сбросить громкость участника к значению по умолчанию
    public resetParticipantVolume(socketId: string): void {
        this.participantVolumes.set(socketId, 100);
    }

    // Удалить участника из store
    public removeParticipant(socketId: string): void {
        this.participantVolumes.delete(socketId);
    }

    // Сбросить все громкости
    public resetAllVolumes(): void {
        this.participantVolumes.clear();
    }

    // Получить все громкости
    public getAllVolumes(): Map<string, number> {
        return new Map(this.participantVolumes);
    }
}

const participantVolumeStore = new ParticipantVolumeStore();
export default participantVolumeStore;
