import { LitElement } from 'lit';
import { TemplateResult } from 'lit/html';
export declare enum PlayerState {
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
/**
 * Load a resource from a path URL
 */
export declare function fetchPath(path: string): Promise<JSON>;
/**
 * DotLottiePlayer web component class
 *
 * @export
 * @class DotLottiePlayer
 * @extends { LitElement }
 */
export declare class DotLottiePlayer extends LitElement {
    /**
     * Autoplay animation on load.
     */
    autoplay: boolean;
    /**
     * Background color.
     */
    background?: string;
    /**
     * Show controls.
     */
    controls: boolean;
    /**
     * Number of times to loop animation.
     */
    count?: number;
    /**
     * Player state.
     */
    currentState: PlayerState;
    /**
     * Animation description for screen readers.
     */
    description: string;
    /**
     * Direction of animation.
     */
    direction: number;
    /**
     * Whether to play on mouse hover
     */
    hover: boolean;
    /**
     * Intermission
     */
    intermission: number;
    /**
     * Whether to loop animation.
     */
    loop: boolean;
    /**
     * Play mode
     */
    mode: PlayMode;
    /**
     * Aspect ratio
    */
    preserveAspectRatio: string;
    /**
     * Renderer to use.
     */
    renderer: "svg";
    /**
     * Seeker
     */
    seeker: any;
    /**
     * Animation speed.
     */
    speed: number;
    /**
     * Bodymovin JSON data or URL to JSON.
     */
    src?: string;
    /**
    * Enable web workers
    */
    webworkers?: boolean;
    /**
     * Animation container.
     */
    protected container: HTMLElement;
    private _io;
    private _lottie?;
    private _prevState?;
    private _counter;
    /**
     * Configure and initialize lottie-web player instance.
     */
    load(src: string | Record<string, any>, overrideRendererSettings?: Record<string, unknown>): Promise<void>;
    /**
     * Handle visibility change events.
     */
    private _onVisibilityChange;
    /**
     * Handles click and drag actions on the progress track.
     */
    private _handleSeekChange;
    private isLottie;
    /**
     * Returns the lottie-web instance used in the component.
     */
    getLottie(): any;
    /**
     * Start playing animation.
     */
    play(): void;
    /**
     * Pause animation play.
     */
    pause(): void;
    /**
     * Stops animation play.
     */
    stop(): void;
    /**
     * Destroy animation and lottie-player element.
     */
    destroy(): void;
    /**
     * Seek to a given frame.
     */
    seek(value: number | string): void;
    /**
     * Snapshot the current frame as SVG.
     *
     * If 'download' argument is boolean true, then a download is triggered in browser.
     */
    snapshot(download?: boolean): string | void;
    /**
     * Freeze animation play.
     * This internal state pauses animation and is used to differentiate between
     * user requested pauses and component instigated pauses.
     */
    private freeze;
    /**
     * Reloads animation.
     *
     */
    reload(): Promise<void>;
    /**
     * Sets animation play speed.
     *
     * @param value Playback speed.
     */
    setSpeed(value?: number): void;
    /**
     * Animation play direction.
     *
     * @param value Direction values.
     */
    setDirection(value: number): void;
    /**
     * Sets the looping of the animation.
     *
     * @param value Whether to enable looping. Boolean true enables looping.
     */
    setLooping(value: boolean): void;
    /**
     * Toggle playing state.
     */
    togglePlay(): void;
    /**
     * Toggles animation looping.
     */
    toggleLooping(): void;
    /**
     * Returns the styles for the component.
     */
    static get styles(): import("lit").CSSResult;
    /**
     * Initialize everything on component first render.
     */
    protected firstUpdated(): Promise<void>;
    /**
     * Cleanup on component destroy.
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
//# sourceMappingURL=dotlottie-player.d.ts.map