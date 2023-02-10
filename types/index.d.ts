
import { CSSResult, LitElement, TemplateResult } from 'lit';
import { AnimationDirection, AnimationItem, RendererType } from 'lottie-web';
import { Unzipped } from 'fflate';

export enum PlayerState {
  Completed = 'completed',
  Destroyed = 'destroyed',
  Error = 'error',
  Frozen = 'frozen',
  Loading = 'loading',
  Paused = 'paused',
  Playing = 'playing',
  Stopped = 'stopped',
}

export enum PlayMode {
  Bounce = 'bounce',
  Normal = 'normal',
}

export enum PlayerEvents {
  Complete = 'complete',
  Destroyed = 'destroyed',
  Error = 'error',
  Frame = 'frame',
  Freeze = 'freeze',
  Load = 'load',
  Loop = 'loop',
  Pause = 'pause',
  Play = 'play',
  Ready = 'ready',
  Rendered = 'rendered',
  Stop = 'stop',
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
}

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
  static get styles(): CSSResult;
  connectedCallback(): void;
  protected firstUpdated(): Promise<void>;
  disconnectedCallback(): void;
  protected renderControls(): TemplateResult<1>;
  protected render(): TemplateResult | void;
}
declare global {
  interface HTMLElementTagNameMap {
    'dotlottie-player': DotLottiePlayer;
  }
}
export type ObjectFit = 'contain' | 'cover' | 'fill' | 'scale-down' | 'none';
export type PreserveAspectRatio = 'xMidYMid meet' | 'xMidYMid slice' | 'xMinYMin slice' | 'none';