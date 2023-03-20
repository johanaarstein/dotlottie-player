import { html, LitElement, nothing } from 'lit'
import type { CSSResult, TemplateResult } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import Lottie from 'lottie-web'
import type { AnimationItem, AnimationDirection, RendererType } from 'lottie-web'

import { PlayMode, PlayerEvents, PlayerState } from './types'
import type { Autoplay, Controls, Loop, ObjectFit, PreserveAspectRatio } from './types'

import { aspectRatio, fetchPath } from './functions'

import styles from './styles'

/**
 * dotLottie Player Web Component class
 *
 * @export
 * @class DotLottiePlayer
 * @extends { LitElement }
 */
@customElement('dotlottie-player')
export class DotLottiePlayer extends LitElement {
  
  /**
   * Autoplay
   */
  @property({ type: Boolean, reflect: true })
  autoplay?: Autoplay

  /**
   * Background color
   */
  @property({ type: String })
  background?: string = 'transparent'

  /**
   * Display controls
   */
  @property({ type: Boolean, reflect: true })
  controls?: Controls = false

  /**
   * Number of times to loop
   */
  @property({ type: Number })
  count?: number

  /**
   * Player state
   */
  @property({ type: String })
  currentState?: PlayerState = PlayerState.Loading
 
  /**
   * Description for screen readers
   */
  @property({ type: String })
  description?: string

  /**
   * Direction of animation
   */
  @property({ type: Number })
  direction?: AnimationDirection = 1

  /**
   * Whether to play on mouseover
   */
  @property({ type: Boolean })
  hover? = false

  /**
   * Intermission
   */
  @property()
  intermission? = 0

  /**
   * Whether to loop
   */
  @property({ type: Boolean, reflect: true })
  loop?: Loop = false

  /**
   * Play mode
   */
  @property()
  mode?: PlayMode = PlayMode.Normal

  /**
   * Resizing to container
  */
  @property({ type: String })
  objectfit?: ObjectFit = 'contain'

  /**
   * Resizing to container (Deprecated)
  */
  @property({ type: String })
  preserveAspectRatio?: PreserveAspectRatio

  /**
   * Renderer to use (svg, canvas or html)
   */
  @property({ type: String })
  renderer?: RendererType = 'svg'

  /**
   * Seeker
   */
  @property()
  seeker?: number

  /**
   * Speed
   */
  @property({ type: Number })
  speed?: number = 1

  /**
   * JSON/dotLottie data or URL
   */
  @property({ type: String })
  src!: string

  /**
   * Container
   */
  @query('.animation')
  protected container!: HTMLElement

  private _io?: IntersectionObserver
  private _lottie: AnimationItem | null = null
  private _prevState?: PlayerState
  private _counter = 0

  /**
   * Initialize Lottie Web player
   */
  public async load(src: string | Record<string, any>): Promise<void> {
    if (!this.shadowRoot) {
      return
    }

    const preserveAspectRatio = this.preserveAspectRatio ?? aspectRatio(this.objectfit as ObjectFit),
    
      options: any = {
        container: this.container,
        loop: this.loop,
        autoplay: this.autoplay,
        renderer: this.renderer,
        rendererSettings: {
          hideOnTransparent: true,
          preserveAspectRatio,
          progressiveLoad: true,
        }
      }
    
    switch (this.renderer) {
      case 'canvas':
        options.rendererSettings = {
          clearCanvas: true,
          preserveAspectRatio,
          progressiveLoad: true,
        }
        break
      case 'html':
        options.rendererSettings = {
          hideOnTransparent: true
        }
    }

    // Load the resource
    try {
      if (typeof src !== 'string' && typeof src !== 'object') {
        throw new Error('No Lottie animation to load, or the file is corrupted.')
      }

      const srcParsed = typeof src === 'string' ? await fetchPath(src) : src

      if (!this.isLottie(srcParsed)) throw new Error('dotLottie: Load method failed. Object is not a valid Lottie.')

      // Clear previous animation, if any
      if (this._lottie) this._lottie.destroy()

      // Initialize lottie player and load animation
      this._lottie = Lottie.loadAnimation({
        ...options,
        animationData: srcParsed,
      })
    } catch (err) {
      // console.log(err)
      this.currentState = PlayerState.Error

      this.dispatchEvent(new CustomEvent(PlayerEvents.Error))
      return
    }

    if (this._lottie) {
      // Calculate and save the current progress of the animation
      this._lottie.addEventListener('enterFrame', () => {
        const { currentFrame, totalFrames } = this._lottie as AnimationItem
        this.seeker = (currentFrame / totalFrames) * 100

        this.dispatchEvent(
          new CustomEvent(PlayerEvents.Frame, {
            detail: {
              frame: currentFrame,
              seeker: this.seeker,
            },
          }),
        )
      })

      // Handle animation play complete
      this._lottie.addEventListener('complete', () => {
        if (this.currentState !== PlayerState.Playing) {
          this.dispatchEvent(new CustomEvent(PlayerEvents.Complete))
          return
        }

        if (!this.loop || (!!this.count && this._counter >= this.count)) {
          this.dispatchEvent(new CustomEvent(PlayerEvents.Complete))
          this.currentState = PlayerState.Completed
          return
        }

        if (this.mode === PlayMode.Bounce) {
          if (this.count) {
            this._counter += 0.5
          }

          setTimeout(() => {
            this.dispatchEvent(new CustomEvent(PlayerEvents.Loop))

            if (this.currentState === PlayerState.Playing) {
              this._lottie?.setDirection(this._lottie.playDirection * -1 as AnimationDirection)
              this._lottie?.play()
            }
          }, this.intermission ?? 0)
        } else {
          if (this.count) {
            this._counter += 1
          }

          setTimeout(() => {
            this.dispatchEvent(new CustomEvent(PlayerEvents.Loop))

            if (this.currentState === PlayerState.Playing) {
              this._lottie?.stop()
              this._lottie?.play()
            }
          }, this.intermission ?? 0)
        }
      })

      // Handle lottie-web ready event
      this._lottie.addEventListener('DOMLoaded', () => {
        this.dispatchEvent(new CustomEvent(PlayerEvents.Ready))
      })

      // Handle animation data load complete
      this._lottie.addEventListener('data_ready', () => {
        this.dispatchEvent(new CustomEvent(PlayerEvents.Load))
      })

      // Set error state when animation load fail event triggers
      this._lottie.addEventListener('data_failed', () => {
        this.currentState = PlayerState.Error

        this.dispatchEvent(new CustomEvent(PlayerEvents.Error))
      })

      if (this.container) {
        // Set handlers to auto play animation on hover if enabled
        this.container.addEventListener('mouseenter', () => {
          if (this.hover && this.currentState !== PlayerState.Playing) {
            this.play()
          }
        })
        this.container.addEventListener('mouseleave', () => {
          if (this.hover && this.currentState === PlayerState.Playing) {
            this.stop()
          }
        })
      }

      // Set initial playback speed and direction
      this.setSpeed(this.speed)
      this.setDirection(this.direction as AnimationDirection)

      // Start playing if autoplay is enabled
      if (this.autoplay) this.play()
    }
  }

  /**
   * Handle visibility change events
   */
  private _onVisibilityChange(): void {
    if (document.hidden && this.currentState === PlayerState.Playing) {
      this.freeze()
    } else if (this.currentState === PlayerState.Frozen) {
      this.play()
    }
  }

  /**
   * Handles click and drag actions on the progress track
   */
  private _handleSeekChange(event: Event & { target: HTMLInputElement }): void {
    if (!event.target || !this._lottie || isNaN(Number(event.target.value))) return

    const frame: number = (Number(event.target.value) / 100) * this._lottie.totalFrames

    this.seek(frame)
  }

  private isLottie(json: Record<string, number | undefined>): boolean {
    const mandatory: string[] = ['v', 'ip', 'op', 'layers', 'fr', 'w', 'h']

    return mandatory.every((field: string) => Object.prototype.hasOwnProperty.call(json, field))
  }

  /**
   * Returns the lottie-web instance used in the component
   */
  public getLottie(): AnimationItem | null {
    return this._lottie
  }

  /**
   * Play
   */
  public play() {
    if (!this._lottie) return

    this._lottie.play()
    this.currentState = PlayerState.Playing

    this.dispatchEvent(new CustomEvent(PlayerEvents.Play))
  }

  /**
   * Pause
   */
  public pause(): void {
    if (!this._lottie) return

    this._lottie.pause()
    this.currentState = PlayerState.Paused

    this.dispatchEvent(new CustomEvent(PlayerEvents.Pause))
  }

  /**
   * Stop
   */
  public stop(): void {
    if (!this._lottie) return

    this._counter = 0
    this._lottie.stop()
    this.currentState = PlayerState.Stopped

    this.dispatchEvent(new CustomEvent(PlayerEvents.Stop))
  }

  /**
   * Destroy animation and element
   */
  public destroy(): void {
    if (!this._lottie) return

    this._lottie.destroy()
    this._lottie = null
    this.currentState = PlayerState.Destroyed
    this.dispatchEvent(new CustomEvent(PlayerEvents.Destroyed))
    this.remove()
  }

  /**
   * Seek to a given frame
   */
  public seek(value: number | string): void {
    if (!this._lottie) return

    // Extract frame number from either number or percentage value
    const matches = value.toString().match(/^([0-9]+)(%?)$/)
    if (!matches) {
      return
    }

    // Calculate and set the frame number
    const frame = matches[2] === '%' ? (this._lottie.totalFrames * Number(matches[1])) / 100 : matches[1]

    // Set seeker to new frame number
    this.seeker = Number(frame)

    // Send lottie player to the new frame
    if (this.currentState === PlayerState.Playing) {
      this._lottie.goToAndPlay(frame, true)
    } else {
      this._lottie.goToAndStop(frame, true)
      this._lottie.pause()
    }
  }

  /**
   * Snapshot the current frame as SVG
   *
   * If 'download' is true, a download is triggered in the browser
   */
  public snapshot(download = true): string | void {
    if (!this.shadowRoot) return

    // Get SVG element and serialize markup
    const svgElement = this.shadowRoot.querySelector('.animation svg')
    const data = svgElement instanceof Node ? new XMLSerializer().serializeToString(svgElement) : null

    if (!data) return

    // Trigger file download
    if (download) {
      const element = document.createElement('a')
      element.href = 'data:image/svg+xmlcharset=utf-8,' + encodeURIComponent(data)
      element.download = 'download_' + this.seeker + '.svg'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    }

    return data
  }

  /**
   * Freeze animation.
   * This internal state pauses animation and is used to differentiate between
   * user requested pauses and component instigated pauses.
   */
  private freeze(): void {
    if (!this._lottie) return
    this._lottie.pause()
    this.currentState = PlayerState.Frozen

    this.dispatchEvent(new CustomEvent(PlayerEvents.Freeze))
  }

  /**
   * Reload animation
   */
  public async reload(): Promise<void> {
    if (!this._lottie) return
    
    this._lottie.destroy()

    if (this.src) {
      await this.load(this.src)
    }
  }

  /**
   * Set animation play speed
   * @param value Playback speed.
   */
  public setSpeed(value = 1): void {
    if (!this._lottie) return
    this._lottie.setSpeed(value)
  }

  /**
   * Animation play direction
   * @param value AnimationDirection
   */
  public setDirection(value: AnimationDirection): void {
    if (!this._lottie) return
    this._lottie.setDirection(value)
  }

  /**
   * Set loop
   */
  public setLooping(value: boolean): void {
    if (this._lottie) {
      this.loop = value
      this._lottie.loop = value
    }
  }

  /**
   * Toggle playing state
   */
  public togglePlay(): void {
    if (!this._lottie) return
    if (this.currentState === PlayerState.Playing) return this.pause()
    if (this.currentState === PlayerState.Completed) {
      if (this._lottie?.playDirection !== -1) {
        return this._lottie.goToAndPlay(0, true)
      }
      return this._lottie.goToAndPlay(this._lottie.totalFrames, true)
    }
    return this.play()
  }

  /**
   * Toggle loop
   */
  public toggleLooping(): void {
    this.setLooping(!this.loop)
  }

  /**
   * Return the styles for the component
   */
  static override get styles(): CSSResult {
    return styles
  }

  /**
   * Initialize everything on component first render
   */
  override connectedCallback(): void {
    super.connectedCallback()
  
    // Add listener for Visibility API's change event.
    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', this._onVisibilityChange)
    }

  }

  protected override async firstUpdated(): Promise<void> {
    // Add intersection observer for detecting component being out-of-view.
    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          if (this.currentState === PlayerState.Frozen) {
            this.play()
          }
        } else if (this.currentState === PlayerState.Playing) {
          this.freeze()
        }
      })

      this._io.observe(this.container)
    }
    
    // Setup lottie player
    if (this.src) {
      await this.load(this.src)
    }
    this.dispatchEvent(new CustomEvent(PlayerEvents.Rendered))
  }

  /**
   * Cleanup on component destroy
   */
  override disconnectedCallback(): void {
    super.disconnectedCallback()

    // Remove intersection observer for detecting component being out-of-view
    if (this._io) {
      this._io.disconnect()
      this._io = undefined
    }

    // Destroy the animation instance
    if (this._lottie) this._lottie.destroy()

    // Remove the attached Visibility API's change event listener
    document.removeEventListener('visibilitychange', () => this._onVisibilityChange())
  }

  protected renderControls() {
    const isPlaying: boolean = this.currentState === PlayerState.Playing
    const isPaused: boolean = this.currentState === PlayerState.Paused
    const isStopped: boolean = this.currentState === PlayerState.Stopped

    return html`
      <div class="lottie-controls toolbar" aria-label="Lottie Animation Controls" class="toolbar">
        <button
          name="lottie-play-button"
          @click=${this.togglePlay}
          class=${isPlaying || isPaused ? 'active' : ''}
          style="align-items:center"
          tabindex="0"
          aria-label="Toggle Play/Pause"
        >
        ${isPlaying ?
        html`
          <svg width="24" height="24" aria-hidden="true" focusable="false">
            <path d="M14.016 5.016H18v13.969h-3.984V5.016zM6 18.984V5.015h3.984v13.969H6z" />
          </svg>
          ` :
        html`
          <svg width="24" height="24" aria-hidden="true" focusable="false">
            <path d="M8.016 5.016L18.985 12 8.016 18.984V5.015z" />
          </svg>
        `}
        </button>
        <button
          name="lottie-stop-button"
          @click=${this.stop}
          class=${isStopped ? 'active' : ''}
          style="align-items:center"
          tabindex="0"
          aria-label="Stop"
        >
          <svg width="24" height="24" aria-hidden="true" focusable="false">
            <path d="M6 6h12v12H6V6z" />
          </svg>
        </button>
        <input
          name="lottie-seeker-input"
          class="seeker"
          type="range"
          min="0"
          step="1"
          max="100"
          value=${this.seeker ?? 0}
          @input=${this._handleSeekChange}
          @mousedown=${() => {
            this._prevState = this.currentState
            this.freeze()
          }}
          @mouseup=${() => {
            this._prevState === PlayerState.Playing && this.play()
          }}
          aria-valuemin="1"
          aria-valuemax="100"
          role="slider"
          aria-valuenow=${this.seeker ?? 0}
          tabindex="0"
          aria-label="Slider for search"
        />
        <button
          name="lottie-loop-toggle"
          @click=${this.toggleLooping}
          class=${this.loop ? 'active' : ''}
          style="align-items:center"
          tabindex="0"
          aria-label="Toggle Looping"
        >
          <svg width="24" height="24" aria-hidden="true" focusable="false">
            <path
              d="M17.016 17.016v-4.031h1.969v6h-12v3l-3.984-3.984 3.984-3.984v3h10.031zM6.984 6.984v4.031H5.015v-6h12v-3l3.984 3.984-3.984 3.984v-3H6.984z"
            />
          </svg>
        </button>
      </div>
    `
  }

  protected override render(): TemplateResult | void {
    const className: string = this.controls ? 'main controls' : 'main',
      animationClass: string = this.controls ? 'animation controls' : 'animation'
    
    return html`
      <div
        class=${'animation-container ' + className}
        lang=${this.description ? document?.documentElement?.lang : 'en'}
        role="img"
        aria-label=${this.description ?? 'Lottie animation'}
      >
        <div class=${animationClass} style="background:${this.background}">
          ${this.currentState === PlayerState.Error ?
            html`<div class="error">⚠️</div>` : nothing
          }
        </div>
        ${this.controls ? this.renderControls() : nothing}
      </div>
    `
  }
}