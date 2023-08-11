import { html, LitElement, nothing } from 'lit'
import type { CSSResult, TemplateResult } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import Lottie from 'lottie-web'
import type {
  AnimationConfig,
  AnimationDirection,
  AnimationEventName,
  AnimationItem,
  AnimationSegment,
  RendererType
} from 'lottie-web'

import { PlayMode, PlayerEvents, PlayerState } from './types'
import type {
  Autoplay,
  Controls,
  Loop,
  ObjectFit,
  PreserveAspectRatio,
  Subframe
} from './types'

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
  @property({ type: Number })
  intermission? = 0

  /**
   * Whether to loop
   */
  @property({ type: Boolean, reflect: true })
  loop?: Loop = false

  /**
   * Play mode
   */
  @property({ type: String })
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
   * Segment
   */
  @property({ type: Array })
  segment?: AnimationSegment | string

  /**
   * Seeker
   */
  @property({ type: Number })
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
   * Subframe
   */
  @property({ type: Boolean })
  subframe?: Subframe = false

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
  public async load(src: string | Record<string, number | undefined> | JSON): Promise<void> {
    if (!this.shadowRoot) {
      return
    }

    const preserveAspectRatio =
      this.preserveAspectRatio ?? (this.objectfit && aspectRatio(this.objectfit)),
    
      options: AnimationConfig<'svg' | 'canvas' | 'html'> = {
        container: this.container,
        loop: !!this.loop,
        autoplay: !!this.autoplay,
        renderer: this.renderer,
        initialSegment: this.segment as AnimationSegment,
        rendererSettings: {
          imagePreserveAspectRatio: preserveAspectRatio,
        }
      }
    
    switch (this.renderer) {
      case 'svg':
        options.rendererSettings = {
          ...options.rendererSettings,
          hideOnTransparent: true,
          preserveAspectRatio,
          progressiveLoad: true,
        }
        break
      case 'canvas':
        options.rendererSettings  = {
          ...options.rendererSettings,
          clearCanvas: true,
          preserveAspectRatio,
          progressiveLoad: true,
        }
        break
      case 'html':
        options.rendererSettings = {
          ...options.rendererSettings,
          hideOnTransparent: true
        }
    }

    // Load the resource
    try {
      if (typeof src !== 'string' && typeof src !== 'object') {
        throw new Error('Invalid file format')
      }

      const srcParsed = typeof src === 'string' ? await fetchPath(src) : src

      if (!this.isLottie(srcParsed)) {
        throw new Error('Corrupted file')
      }

      // Clear previous animation, if any
      if (this._lottie) this._lottie.destroy()

      // Initialize lottie player and load animation
      this._lottie = Lottie.loadAnimation({
        ...options,
        animationData: srcParsed,
      })
    } catch (err) {
      console.error(err)
      
      this.currentState = PlayerState.Error

      this.dispatchEvent(new CustomEvent(PlayerEvents.Error))
      return
    }

    if (this._lottie) {

      // Calculate and save the current progress of the animation
      this._lottie.addEventListener<AnimationEventName>('enterFrame', () => {
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
      this._lottie.addEventListener<AnimationEventName>('complete', () => {          
        this.currentState = PlayerState.Completed
        this.dispatchEvent(new CustomEvent(PlayerEvents.Complete))
      })

      //Handle complete loop
      const _loopComplete = () => {
        const {
          firstFrame,
          totalFrames,
          playDirection,
        } = this._lottie as AnimationItem

        if (this.count) {

          this.mode === PlayMode.Bounce ?
            this._counter += 1 : this._counter += 0.5

          if (this._counter >= this.count) {
            this.setLooping(false)

            this.currentState = PlayerState.Completed
            this.dispatchEvent(new CustomEvent(PlayerEvents.Complete))

            return
          }
        }

        this.dispatchEvent(new CustomEvent(PlayerEvents.Loop))

        if (this.mode === PlayMode.Bounce) {
            this._lottie?.goToAndStop(
            playDirection === -1 ? firstFrame : totalFrames * .99, true
          )
          
          this._lottie?.setDirection(playDirection * -1 as AnimationDirection)
          
          return setTimeout(() => {
            this._lottie?.play()
          }, this.intermission)
        }
        
        this._lottie?.goToAndStop(
          playDirection === -1 ? totalFrames * .99 : firstFrame, true
        )

        return setTimeout(() => {
          this._lottie?.play()
        }, this.intermission)
      }

      this._lottie.addEventListener<AnimationEventName>('loopComplete', _loopComplete)

      // Handle lottie-web ready event
      this._lottie.addEventListener<AnimationEventName>('DOMLoaded', () => {
        this.dispatchEvent(new CustomEvent(PlayerEvents.Ready))
      })

      // Handle animation data load complete
      this._lottie.addEventListener<AnimationEventName>('data_ready', () => {
        this.dispatchEvent(new CustomEvent(PlayerEvents.Load))
      })

      // Set error state when animation load fail event triggers
      this._lottie.addEventListener<AnimationEventName>('data_failed', () => {
        
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
      this.setSubframe(!!this.subframe)

      // Start playing if autoplay is enabled
      if (this.autoplay) {
        if (this.direction === -1) this.seek('99%')
        this.play()
      }
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

    const frame: number =
      (Number(event.target.value) / 100) * this._lottie.totalFrames

    this.seek(frame)
  }

  private isLottie(json: Record<string, number | undefined> | JSON): boolean {
    const mandatory: string[] = ['v', 'ip', 'op', 'layers', 'fr', 'w', 'h']

    return mandatory.every((field: string) =>
      Object.prototype.hasOwnProperty.call(json, field))
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

    this.currentState = PlayerState.Playing
    this._lottie.play()

    this.dispatchEvent(new CustomEvent(PlayerEvents.Play))
  }

  /**
   * Pause
   */
  public pause(): void {
    if (!this._lottie) return

    this.currentState = PlayerState.Paused
    this._lottie.pause()

    this.dispatchEvent(new CustomEvent(PlayerEvents.Pause))
  }

  /**
   * Stop
   */
  public stop(): void {
    if (!this._lottie) return

    this.currentState = PlayerState.Stopped

    this._counter = 0
    this._lottie.stop()

    this.dispatchEvent(new CustomEvent(PlayerEvents.Stop))
  }

  /**
   * Destroy animation and element
   */
  public destroy(): void {
    if (!this._lottie) return

    this.currentState = PlayerState.Destroyed

    this._lottie.destroy()
    this._lottie = null
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
    const frame =
      matches[2] === '%' ? (this._lottie.totalFrames * Number(matches[1])) / 100 : Number(matches[1])

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
    const data =
      svgElement instanceof Node ?
        new XMLSerializer().serializeToString(svgElement) : null

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

  public setSubframe(value: boolean): void {
    if (!this._lottie) return
    this.subframe = value
    this._lottie.setSubframe(value)
  }

  /**
   * Freeze animation.
   * This internal state pauses animation and is used to differentiate between
   * user requested pauses and component instigated pauses.
   */
  private freeze(): void {
    if (!this._lottie) return

    this.currentState = PlayerState.Frozen
    this._lottie.pause()

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
    this.speed = value
    this._lottie.setSpeed(value)
  }

  /**
   * Animation play direction
   * @param value AnimationDirection
   */
  public setDirection(value: AnimationDirection): void {
    if (!this._lottie) return
    this.direction = value
    this._lottie.setDirection(value)
  }

  /**
   * Set loop
   */
  public setLooping(value: boolean): void {
    if (this._lottie) {
      this.loop = value
      this._lottie.setLoop(value)
    }
  }

  /**
   * Toggle playing state
   */
  public togglePlay(): void {
    if (!this._lottie) return
    
    const { currentFrame, playDirection, totalFrames } = this._lottie
    if (this.currentState === PlayerState.Playing) return this.pause()
    if (this.currentState === PlayerState.Completed) {
      this.currentState = PlayerState.Playing
      if (this.mode === PlayMode.Bounce) {
        this.setDirection(playDirection * -1 as AnimationDirection)
        return this._lottie.goToAndPlay(currentFrame, true)
      }
      if (playDirection === -1) {
        return this._lottie.goToAndPlay(totalFrames, true)
      }
      return this._lottie.goToAndPlay(0, true)
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
   * Toggle Boomerang
   */
  public toggleBoomerang(): void {
    if (this.mode === PlayMode.Normal) {
      this.mode = PlayMode.Bounce
    } else {
      this.mode = PlayMode.Normal
    }
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
          if (!document.hidden && this.currentState === PlayerState.Frozen) {
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
    document.removeEventListener('visibilitychange', this._onVisibilityChange)
  }

  protected renderControls() {
    const isPlaying = this.currentState === PlayerState.Playing,
      isPaused = this.currentState === PlayerState.Paused,
      isStopped = this.currentState === PlayerState.Stopped,
      isError = this.currentState === PlayerState.Error

    return html`
      <div
        class=${`lottie-controls toolbar ${isError ? 'has-error': ''}`}
        aria-label="Lottie Animation Controls"
      >
        <button
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
          class="seeker"
          type="range"
          min="0"
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
          aria-valuemin="0"
          aria-valuemax="100"
          role="slider"
          aria-valuenow=${this.seeker ?? 0}
          tabindex="0"
          aria-label="Slider for search"
        />
        <button
          @click=${this.toggleLooping}
          class=${this.loop ? 'active' : ''}
          style="align-items:center"
          tabindex="0"
          aria-label="Toggle looping"
        >
          <svg width="24" height="24" aria-hidden="true" focusable="false">
            <path
              d="M17.016 17.016v-4.031h1.969v6h-12v3l-3.984-3.984 3.984-3.984v3h10.031zM6.984 6.984v4.031H5.015v-6h12v-3l3.984 3.984-3.984 3.984v-3H6.984z"
            />
          </svg>
        </button>
        <button
          @click=${this.toggleBoomerang}
          class=${this.mode === PlayMode.Bounce ? 'active' : ''}
          aria-label="Toggle boomerang"
          style="align-items:center"
          tabindex="0"
        >
          <svg width="24" height="24" aria-hidden="true" focusable="false">
            <path
              d="m11.8 13.2-.3.3c-.5.5-1.1 1.1-1.7 1.5-.5.4-1 .6-1.5.8-.5.2-1.1.3-1.6.3s-1-.1-1.5-.3c-.6-.2-1-.5-1.4-1-.5-.6-.8-1.2-.9-1.9-.2-.9-.1-1.8.3-2.6.3-.7.8-1.2 1.3-1.6.3-.2.6-.4 1-.5.2-.2.5-.2.8-.3.3 0 .7-.1 1 0 .3 0 .6.1.9.2.9.3 1.7.9 2.4 1.5.4.4.8.7 1.1 1.1l.1.1.4-.4c.6-.6 1.2-1.2 1.9-1.6.5-.3 1-.6 1.5-.7.4-.1.7-.2 1-.2h.9c1 .1 1.9.5 2.6 1.4.4.5.7 1.1.8 1.8.2.9.1 1.7-.2 2.5-.4.9-1 1.5-1.8 2-.4.2-.7.4-1.1.4-.4.1-.8.1-1.2.1-.5 0-.9-.1-1.3-.3-.8-.3-1.5-.9-2.1-1.5-.4-.4-.8-.7-1.1-1.1h-.3zm-1.1-1.1c-.1-.1-.1-.1 0 0-.3-.3-.6-.6-.8-.9-.5-.5-1-.9-1.6-1.2-.4-.3-.8-.4-1.3-.4-.4 0-.8 0-1.1.2-.5.2-.9.6-1.1 1-.2.3-.3.7-.3 1.1 0 .3 0 .6.1.9.1.5.4.9.8 1.2.5.4 1.1.5 1.7.5.5 0 1-.2 1.5-.5.6-.4 1.1-.8 1.6-1.3.1-.3.3-.5.5-.6zM13 12c.5.5 1 1 1.5 1.4.5.5 1.1.9 1.9 1 .4.1.8 0 1.2-.1.3-.1.6-.3.9-.5.4-.4.7-.9.8-1.4.1-.5 0-.9-.1-1.4-.3-.8-.8-1.2-1.7-1.4-.4-.1-.8-.1-1.2 0-.5.1-1 .4-1.4.7-.5.4-1 .8-1.4 1.2-.2.2-.4.3-.5.5z"
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
        class=${`animation-container ${className}`}
        lang=${this.description ? document?.documentElement?.lang : 'en'}
        role="img"
        aria-label=${this.description ?? 'Lottie animation'}
      >
        <div class=${animationClass} style="background:${this.background}">
          ${this.currentState === PlayerState.Error ?
            html`
              <div class="error">
                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" x="0" y="0" version="1.1" viewBox="0 0 1920 1080" width="1920" height="1080">
                  <path fill="#fff" d="M0 0h1920v1080H0z"/>
                  <path fill="#3a6d8b" d="M1190.2 531 1007 212.4c-22-38.2-77.2-38-98.8.5L729.5 531.3c-21.3 37.9 6.1 84.6 49.5 84.6l361.9.3c43.7 0 71.1-47.3 49.3-85.2zM937.3 288.7c.2-7.5 3.3-23.9 23.2-23.9 16.3 0 23 16.1 23 23.5 0 55.3-10.7 197.2-12.2 214.5-.1 1-.9 1.7-1.9 1.7h-18.3c-1 0-1.8-.7-1.9-1.7-1.4-17.5-13.4-162.9-11.9-214.1zm24.2 283.8c-13.1 0-23.7-10.6-23.7-23.7s10.6-23.7 23.7-23.7 23.7 10.6 23.7 23.7-10.6 23.7-23.7 23.7zM722.1 644h112.6v34.4h-70.4V698h58.8v31.7h-58.8v22.6h72.4v36.2H722.1V644zM884.1 701.1h.6c8.3-12.9 18.2-17.8 31.3-17.8 3 0 5.1.4 6.3 1v32.6h-.8c-22.4-3.8-35.6 6.3-35.6 29.5v42.3h-38.2V685.5h36.4v15.6zM963 701.1h.6c8.3-12.9 18.2-17.8 31.3-17.8 3 0 5.1.4 6.3 1v32.6h-.8c-22.4-3.8-35.6 6.3-35.6 29.5v42.3h-38.2V685.5H963v15.6zM1002.5 737.3c0-31.3 22.2-54.8 56.6-54.8 34.4 0 56.2 23.5 56.2 54.8s-21.8 54.6-56.2 54.6c-34.4-.1-56.6-23.3-56.6-54.6zm74 0c0-17.4-6.1-29.1-17.8-29.1-11.7 0-17.4 11.7-17.4 29.1 0 17.4 5.7 29.1 17.4 29.1s17.8-11.8 17.8-29.1zM1159.6 701.1h.6c8.3-12.9 18.2-17.8 31.3-17.8 3 0 5.1.4 6.3 1v32.6h-.8c-22.4-3.8-35.6 6.3-35.6 29.5v42.3h-38.2V685.5h36.4v15.6zM722.2 831.3c0-9.9 6.2-17.5 16-17.5 8.2 0 13.1 4.9 13.8 11.2h-6.7c-.6-3.4-3.1-5.6-7-5.6-6.2 0-9.1 5.1-9.1 11.8 0 6.8 3.5 11.7 9.1 11.7 4 0 6.8-2.4 7.2-5.9h6.6c-.2 2.9-1.4 5.8-3.7 7.9-2.3 2.1-5.5 3.5-10.1 3.5-9.4.2-16.1-7.1-16.1-17.1zM761 827.1h.1c1.7-2.5 3.7-3.8 7-3.8 4.9 0 8.3 3.7 8.3 9v15.6H770v-14.7c0-2.6-1.5-4.4-4.2-4.4-2.8 0-4.9 2.2-4.9 5.5v13.6h-6.3v-33.4h6.3v12.6zM778.8 835.9c0-7.1 4.8-12.6 11.8-12.6 7.7 0 11.8 5.9 11.8 14.4H785c.5 3.7 2.5 6 6.1 6 2.5 0 3.9-1.1 4.6-2.9h6.3c-.9 4.2-4.7 7.8-10.8 7.8-8 0-12.4-5.6-12.4-12.7zm6.3-2.6h10.6c-.2-3-2.2-5.1-5.1-5.1-3.3 0-4.9 2-5.5 5.1zM803.7 835.9c0-7.1 4.7-12.6 11.9-12.6 6.2 0 10 3.6 10.9 8.8h-6.2c-.4-2.1-2.1-3.7-4.4-3.7-3.8 0-5.8 2.9-5.8 7.6 0 4.5 1.8 7.6 5.7 7.6 2.6 0 4.4-1.4 4.8-4.1h6.1c-.4 5.1-4.4 9.1-10.8 9.1-7.5 0-12.2-5.5-12.2-12.7zM838.2 837l-2.8 2.8v8.1h-6.3v-33.4h6.3V833l8.5-9.1h7.6l-8.8 9.1 9.9 14.8h-7.7l-6.7-10.8zM861.3 835.9c0-7.1 4.7-12.6 11.9-12.6 6.2 0 10 3.6 10.9 8.8H878c-.4-2.1-2.1-3.7-4.4-3.7-3.8 0-5.8 2.9-5.8 7.6 0 4.5 1.8 7.6 5.7 7.6 2.6 0 4.4-1.4 4.8-4.1h6.1c-.4 5.1-4.4 9.1-10.8 9.1-7.6 0-12.3-5.5-12.3-12.7zM885.5 835.9c0-7.1 5.1-12.6 12.5-12.6s12.5 5.5 12.5 12.6-5.1 12.6-12.5 12.6c-7.4.1-12.5-5.4-12.5-12.6zm18.6 0c0-4.7-2.2-7.8-6.1-7.8-3.9 0-6.1 3.2-6.1 7.8s2.1 7.8 6.1 7.8c3.9 0 6.1-3.1 6.1-7.8zM919.3 827.2h.1c1.6-2.6 3.8-3.9 7.1-3.9 4.9 0 8.3 3.7 8.3 9v15.6h-6.3v-14.7c0-2.6-1.5-4.4-4.2-4.4-2.8 0-4.9 2.2-4.9 5.5v13.6h-6.3V824h6.2v3.2zM937 840.1h5.9c.4 2.8 2.4 4 5.2 4 2.8 0 4.4-1.1 4.4-2.8 0-2.3-3-2.5-6.3-3.2-4.3-.8-8.5-2-8.5-7.2s4.3-7.7 9.8-7.7c6.3 0 9.8 3.1 10.3 7.9h-5.7c-.3-2.6-1.9-3.5-4.6-3.5-2.5 0-4.1.9-4.1 2.7 0 2.1 3.2 2.2 6.6 2.9 4 .8 8.4 2 8.4 7.6 0 4.8-4.1 7.7-10.1 7.7-7.1.1-11-3.3-11.3-8.4zM959.4 835.9c0-7.1 5.1-12.6 12.5-12.6s12.5 5.5 12.5 12.6-5.1 12.6-12.5 12.6c-7.4.1-12.5-5.4-12.5-12.6zm18.6 0c0-4.7-2.2-7.8-6.1-7.8-3.9 0-6.1 3.2-6.1 7.8s2.1 7.8 6.1 7.8c3.9 0 6.1-3.1 6.1-7.8zM987 814.5h6.3v33.4H987v-33.4zM996 835.9c0-7.1 4.8-12.6 11.8-12.6 7.7 0 11.8 5.9 11.8 14.4h-17.4c.5 3.7 2.5 6 6.1 6 2.5 0 3.9-1.1 4.6-2.9h6.3c-.9 4.2-4.7 7.8-10.8 7.8-7.9 0-12.4-5.6-12.4-12.7zm6.3-2.6h10.6c-.2-3-2.2-5.1-5.1-5.1-3.3 0-4.9 2-5.5 5.1zM1029 823.9h3.3v-2.1c0-5.8 4.5-7.9 10.6-7.2v4.9c-3-.1-4.3.2-4.3 2.7v1.8h4.3v4.4h-4.3V848h-6.3v-19.6h-3.3v-4.5zM1043.1 835.9c0-7.1 5.1-12.6 12.5-12.6s12.5 5.5 12.5 12.6-5.1 12.6-12.5 12.6c-7.4.1-12.5-5.4-12.5-12.6zm18.6 0c0-4.7-2.2-7.8-6.1-7.8-3.9 0-6.1 3.2-6.1 7.8s2.1 7.8 6.1 7.8c3.9 0 6.1-3.1 6.1-7.8zM1076.8 827.8h.1c1.4-2.7 3.1-4.1 5.9-4.1.7 0 1.1 0 1.5.2v5.6h-.1c-4.2-.4-7.1 1.8-7.1 6.8V848h-6.3v-23.9h6.1v3.7zM1094.9 823.9h6.1v3.2h.1c1.3-2.2 3.6-3.9 7-3.9 3 0 5.5 1.7 6.6 4.2h.1c1.6-2.6 4.2-4.2 7.2-4.2 5 0 7.9 3.3 7.9 8.5v16.1h-6.3v-15c0-2.7-1.4-4.1-3.7-4.1-2.7 0-4.3 2.1-4.3 5.2v13.9h-6.3v-15c0-2.7-1.4-4.1-3.7-4.1-2.6 0-4.3 2.1-4.3 5.2v13.9h-6.3v-23.9zM1132.4 835.9c0-7.1 5.1-12.6 12.5-12.6s12.5 5.5 12.5 12.6-5.1 12.6-12.5 12.6c-7.4.1-12.5-5.4-12.5-12.6zm18.6 0c0-4.7-2.2-7.8-6.1-7.8-3.9 0-6.1 3.2-6.1 7.8s2.1 7.8 6.1 7.8c3.9 0 6.1-3.1 6.1-7.8zM1166.1 827.8h.1c1.4-2.7 3.1-4.1 5.9-4.1.7 0 1.1 0 1.5.2v5.6h-.1c-4.2-.4-7.1 1.8-7.1 6.8V848h-6.3v-23.9h6.1v3.7zM1174.2 835.9c0-7.1 4.8-12.6 11.8-12.6 7.7 0 11.8 5.9 11.8 14.4h-17.4c.5 3.7 2.5 6 6.1 6 2.5 0 3.9-1.1 4.6-2.9h6.3c-.9 4.2-4.7 7.8-10.8 7.8-7.9 0-12.4-5.6-12.4-12.7zm6.4-2.6h10.6c-.2-3-2.2-5.1-5.1-5.1-3.3 0-5 2-5.5 5.1zM723.1 862.1h6.3v5.7h-6.3v-5.7zm0 9.4h6.3v23.9h-6.3v-23.9zM739.4 874.8h.1c1.6-2.6 3.8-3.9 7.1-3.9 4.9 0 8.3 3.7 8.3 9v15.6h-6.3v-14.7c0-2.6-1.5-4.4-4.2-4.4-2.8 0-4.9 2.2-4.9 5.5v13.6h-6.3v-23.9h6.2v3.2zM756.3 871.5h3.3v-2.1c0-5.8 4.5-7.9 10.6-7.2v4.9c-3-.1-4.3.2-4.3 2.7v1.8h4.3v4.4h-4.3v19.6h-6.3V876h-3.3v-4.5zM770.5 883.5c0-7.1 5.1-12.6 12.5-12.6s12.5 5.5 12.5 12.6-5.1 12.6-12.5 12.6-12.5-5.5-12.5-12.6zm18.6 0c0-4.7-2.2-7.8-6.1-7.8-3.9 0-6.1 3.2-6.1 7.8s2.1 7.8 6.1 7.8c3.9 0 6.1-3.1 6.1-7.8zM804.2 875.3h.1c1.4-2.7 3.1-4.1 5.9-4.1.7 0 1.1 0 1.5.2v5.6h-.1c-4.2-.4-7.1 1.8-7.1 6.8v11.7h-6.3v-23.9h6.1v3.7zM813.5 871.5h6.1v3.2h.1c1.3-2.2 3.6-3.9 7-3.9 3 0 5.5 1.7 6.6 4.2h.1c1.6-2.6 4.2-4.2 7.2-4.2 5 0 7.9 3.3 7.9 8.5v16.1h-6.3v-15c0-2.7-1.4-4.1-3.7-4.1-2.7 0-4.3 2.1-4.3 5.2v13.9h-6.3v-15c0-2.7-1.4-4.1-3.7-4.1-2.6 0-4.3 2.1-4.3 5.2v13.9h-6.3v-23.9zM866.4 892.8c-1.3 1.8-3 3.2-7.1 3.2-4.9 0-8.4-2.6-8.4-7.3 0-5.3 4.3-7 9.6-7.7 4-.6 5.8-.9 5.8-2.7 0-1.7-1.4-2.8-4-2.8-3 0-4.4 1.1-4.6 3.4H852c.2-4.2 3.3-7.9 10.3-7.9 7.2 0 10.1 3.2 10.1 8.8V892c0 1.8.3 2.9.8 3.3v.2h-6.1c-.3-.5-.6-1.6-.7-2.7zm.1-5.8v-3.6c-1.1.7-2.8 1-4.4 1.4-3.3.7-4.9 1.5-4.9 3.7s1.5 3 3.7 3c3.5.1 5.6-2.2 5.6-4.5zM873.9 871.5h3.3V864h6.2v7.5h4.1v4.2h-4.1v12.7c0 1.8 1 2.4 2.4 2.4h1.9v4.7s-1.4.1-4 .1c-3.1 0-6.5-1.2-6.5-5.7v-14h-3.3v-4.4zM890.2 862.1h6.3v5.7h-6.3v-5.7zm0 9.4h6.3v23.9h-6.3v-23.9zM899.1 883.5c0-7.1 5.1-12.6 12.5-12.6s12.5 5.5 12.5 12.6-5.1 12.6-12.5 12.6c-7.5 0-12.5-5.5-12.5-12.6zm18.5 0c0-4.7-2.2-7.8-6.1-7.8-3.9 0-6.1 3.2-6.1 7.8s2.1 7.8 6.1 7.8c3.9 0 6.1-3.1 6.1-7.8zM932.8 874.8h.1c1.6-2.6 3.8-3.9 7.1-3.9 4.9 0 8.3 3.7 8.3 9v15.6H942v-14.7c0-2.6-1.5-4.4-4.2-4.4-2.8 0-4.9 2.2-4.9 5.5v13.6h-6.3v-23.9h6.2v3.2z"/>
                </svg>
              </div>` : nothing
          }
        </div>
        ${this.controls ? this.renderControls() : nothing}
      </div>
    `
  }
}