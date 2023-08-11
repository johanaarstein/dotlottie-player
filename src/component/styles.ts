import { css } from 'lit'

export default css`
  * {
    box-sizing: border-box;
  }

  :host {
    --lottie-player-toolbar-height: 35px;
    --lottie-player-toolbar-background-color: #FFF;
    --lottie-player-toolbar-icon-color: #000;
    --lottie-player-toolbar-icon-hover-color: #000;
    --lottie-player-toolbar-icon-active-color: #4285f4;
    --lottie-player-seeker-track-color: rgba(0, 0, 0, 0.2);
    --lottie-player-seeker-thumb-color: #4285f4;
    --lottie-player-seeker-display: block;

    display: block;
    width: 100%;
    height: 100%;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --lottie-player-toolbar-background-color: #000;
      --lottie-player-toolbar-icon-color: #FFF;
      --lottie-player-toolbar-icon-hover-color: #FFF;
      --lottie-player-seeker-track-color: rgba(255, 255, 255, 0.6);
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .animation {
    width: 100%;
    height: 100%;
    display: flex;
  }
  .animation.controls {
    height: calc(100% - 35px);
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-items: center;
    background: var(--lottie-player-toolbar-background-color);
    margin: 0 5px;
    height: 35px;
    padding: 5px;
    border-radius: 5px;
  }

  .toolbar.has-error {
    pointer-events: none;
    opacity: .5;
  }

  .toolbar button {
    cursor: pointer;
    fill: var(--lottie-player-toolbar-icon-color);
    display: flex;
    background: none;
    border: 0;
    padding: 0;
    outline: 0;
    height: 100%;
  }

  .toolbar button.active {
    fill: var(--lottie-player-toolbar-icon-active-color);
  }

  .toolbar button:focus {
    outline: 0;
  }

  .toolbar button svg > * {
    fill: inherit
  }

  .toolbar button.disabled svg {
    display: none;
  }

  .seeker, .seeker::-webkit-slider-runnable-track, .seeker::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
  }

  .seeker {
    -webkit-appearance: none;
    appearance: none;
    width: 95%;
    background-color: var(--lottie-player-toolbar-background-color);
    display: var(--lottie-player-seeker-display);
    color: var(--lottie-player-seeker-thumb-color);
  }

  .seeker::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background-color: var(--lottie-player-seeker-track-color);
    border-radius: 3px;
  }
  .seeker::-webkit-progress-value {
    background-color: var(--lottie-player-seeker-thumb-color);
  }
  .seeker::-webkit-slider-thumb {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background-color: var(--lottie-player-seeker-thumb-color);
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    margin-top: -5px;
  }
  .seeker:focus::-webkit-slider-runnable-track {
    background-color: var(--lottie-player-seeker-track-color);
  }
  .seeker::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background-color: var(--lottie-player-seeker-track-color);
    border-radius: 3px;
    border: 0;
  }
  .seeker::-moz-range-progress {
    background-color: var(--lottie-player-seeker-thumb-color);
    height: 5px;
    border-radius: 3px;
  }
  .seeker::-moz-range-thumb {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background-color: var(--lottie-player-seeker-thumb-color);
    border: 0;
    cursor: pointer;
  }
  .seeker::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  .seeker::-ms-fill-upper {
    background: var(--lottie-player-seeker-track-color);
    border-radius: 3px;
  }
  .seeker::-ms-fill-lower {
    background-color: var(--lottie-player-seeker-thumb-color);
    border-radius: 3px;
  }
  .seeker::-ms-thumb {
    border: 0;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background: var(--lottie-player-seeker-thumb-color);
    cursor: pointer;
  }
  .seeker:focus::-ms-fill-lower {
    background: var(--lottie-player-seeker-track-color);
  }
  .seeker:focus::-ms-fill-upper {
    background: var(--lottie-player-seeker-track-color);
  }

  .error {
    display: flex;
    margin: auto;
    justify-content: center;
    height: 100%;
    align-items: center;
  }

  .error svg {
    width: 100%;
    height: auto;
  }
`
