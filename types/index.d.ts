import { LitElement } from 'lit';
import { TemplateResult } from 'lit/html';
import { AnimationDirection, RendererType } from 'lottie-web';
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
export declare function fetchPath(path: string): Promise<JSON>;
/**
 * dotLottie Player Web Component class
 *
 * @export
 * @class DotLottiePlayer
 * @extends { LitElement }
 */
export declare class DotLottiePlayer extends LitElement {
    /**
     * Autoplay animation
     */
    autoplay: boolean;
    /**
     * Background color
     */
    background?: string;
    /**
     * Display controls
     */
    controls: boolean;
    /**
     * Number of times to loop animation
     */
    count?: number;
    /**
     * Player state
     */
    currentState?: PlayerState;
    /**
     * Animation description for screen readers
     */
    description?: string;
    /**
     * Direction of animation
     */
    direction: AnimationDirection;
    /**
     * Whether to play on mouse hover
     */
    hover?: boolean | undefined;
    /**
     * Intermission
     */
    intermission?: number | undefined;
    /**
     * Whether to loop animation
     */
    loop: boolean;
    /**
     * Play mode
     */
    mode?: PlayMode;
    /**
     * Aspect ratio
    */
    preserveAspectRatio: string;
    /**
     * Renderer to use (svg, canvas or html)
     */
    renderer: RendererType;
    /**
     * Seeker
     */
    seeker?: any;
    /**
     * Animation speed
     */
    speed?: number;
    /**
     * Bodymovin JSON data, URL to JSON or dotLottie
     */
    src: string;
    /**
     * Animation container
     */
    protected container: HTMLElement;
    private _io?;
    private _lottie;
    private _prevState?;
    private _counter;
    /**
     * Configure and initialize lottie-web player instance
     */
    load(src: string | Record<string, unknown>, overrideRendererSettings?: Record<string, unknown>): Promise<void>;
    /**
     * Handle visibility change events
     */
    private _onVisibilityChange;
    /**
     * Handles click and drag actions on the progress track
     */
    private _handleSeekChange;
    private isLottie;
    /**
     * Returns the lottie-web instance used in the component
     */
    getLottie(): any;
    /**
     * Play
     */
    play(): void;
    /**
     * Pause
     */
    pause(): void;
    /**
     * Stop
     */
    stop(): void;
    /**
     * Destroy animation and lottie-player element
     */
    destroy(): void;
    /**
     * Seek to a given frame
     */
    seek(value: number | string): void;
    /**
     * Snapshot the current frame as SVG
     *
     * If 'download' argument is boolean true, then a download is triggered in browser
     */
    snapshot(download?: boolean): string | void;
    /**
     * Freeze animation.
     * This internal state pauses animation and is used to differentiate between
     * user requested pauses and component instigated pauses.
     */
    private freeze;
    /**
     * Reload animation
     */
    reload(): Promise<void>;
    /**
     * Set animation play speed
     *
     * @param value Playback speed.
     */
    setSpeed(value?: number): void;
    /**
     * Animation play direction
     *
     * @param value AnimationDirection
     */
    setDirection(value: number): void;
    /**
     * Set loop
     */
    setLooping(value: boolean): void;
    /**
     * Toggle playing state
     */
    togglePlay(): void;
    /**
     * Toggle loop
     */
    toggleLooping(): void;
    /**
     * Return the styles for the component
     */
    static get styles(): import("lit").CSSResult;
    /**
     * Initialize everything on component first render
     */
    protected firstUpdated(): Promise<void>;
    /**
     * Cleanup on component destroy
     */
    disconnectedCallback(): void;
    protected renderControls(): TemplateResult<1>;
    render(): TemplateResult | void;
}
declare global {
    interface HTMLElementTagNameMap {
        'dotlottie-player': DotLottiePlayer;
    }
}
//# sourceMappingURL=index.d.ts.map