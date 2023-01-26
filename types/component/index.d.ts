import { LitElement, TemplateResult } from 'lit';
import { AnimationDirection, AnimationItem, RendererType } from 'lottie-web';
import { PlayMode, PlayerState } from './types.d';
export declare class DotLottiePlayer extends LitElement {
    autoplay: boolean;
    background?: string;
    controls: boolean;
    count?: number;
    currentState?: PlayerState;
    description?: string;
    direction: AnimationDirection;
    hover?: boolean | undefined;
    intermission?: number | undefined;
    loop: boolean;
    mode?: PlayMode;
    preserveAspectRatio: string;
    renderer: RendererType;
    seeker?: number;
    speed?: number;
    src: string;
    protected container: HTMLElement;
    private _io?;
    private _lottie;
    private _prevState?;
    private _counter;
    load(src: string | Record<string, unknown>, overrideRendererSettings?: Record<string, unknown>): Promise<void>;
    private _onVisibilityChange;
    private _handleSeekChange;
    private isLottie;
    getLottie(): AnimationItem | null;
    play(): void;
    pause(): void;
    stop(): void;
    destroy(): void;
    seek(value: number | string): void;
    snapshot(download?: boolean): string | void;
    private freeze;
    reload(): Promise<void>;
    setSpeed(value?: number): void;
    setDirection(value: number): void;
    setLooping(value: boolean): void;
    togglePlay(): void;
    toggleLooping(): void;
    static get styles(): import("lit").CSSResult;
    protected firstUpdated(): Promise<void>;
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