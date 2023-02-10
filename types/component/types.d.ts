import { Unzipped } from 'fflate';
export declare enum PlayerState {
    Completed = "completed",
    Destroyed = "destroyed",
    Error = "error",
    Frozen = "frozen",
    Loading = "loading",
    Paused = "paused",
    Playing = "playing",
    Stopped = "stopped"
}
export declare enum PlayMode {
    Bounce = "bounce",
    Normal = "normal"
}
export declare enum PlayerEvents {
    Complete = "complete",
    Destroyed = "destroyed",
    Error = "error",
    Frame = "frame",
    Freeze = "freeze",
    Load = "load",
    Loop = "loop",
    Pause = "pause",
    Play = "play",
    Ready = "ready",
    Rendered = "rendered",
    Stop = "stop"
}
export interface LottieAssets {
    id?: string;
    p?: string;
    e?: number;
    layers?: [];
}
export interface LottieManifest {
    animations: [Record<string, unknown>];
    version?: string;
}
export interface LottieAnimation extends Unzipped {
    "manifest.json": Uint8Array;
}
export type Versions = {
    lottieWebVersion: string;
    dotLottiePlayerVersion: string;
};
export type ObjectFit = 'contain' | 'cover' | 'fill' | 'scale-down' | 'none';
export type PreserveAspectRatio = 'xMidYMid meet' | 'xMidYMid slice' | 'xMinYMin slice' | 'none';
//# sourceMappingURL=types.d.ts.map