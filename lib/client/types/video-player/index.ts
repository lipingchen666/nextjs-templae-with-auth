export interface VideoPlayer<T> {
    initializePlayer(element: HTMLElement): T;
    play(): void;
    pause(): void;
    seek(): void;
}