import { DotLottiePlayer } from '../src'

if (!customElements.get('dotlottie-player')) {
  customElements.define('dotlottie-player', DotLottiePlayer)
}