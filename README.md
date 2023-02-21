# Lottie Player Web Component

![Awesome Vector Animations](/.github/readmeBanner.svg)

This started as a fork of [@dotlottie/player-component](https://github.com/dotlottie/player-component), mainly made to address issues with render settings and aspect ratio. Since then we've added some functionalities here and tweaked some configurations there, and this is now the most versatile Lottie Player Web Component out there – in our humble opinion, of course – and we still managed to trim off some significant weight. The component is built with Lit and compiled with Rust, it's compatible with server side rendering, and like any good web component it's framework agnostic.

## Demo

Here is [a demo](https://www.aarstein.media/en/dev/dotlottie-player), running on Next.js.

## Installation

### In HTML

- Import from CDN:

```xml
<script src="https://unpkg.com/@johanaarstein/dotlottie-player@latest/dist/index.js"></script>
```

- Import from node_modules directory:

```xml
<script src="/node_modules/@johanaarstein/dotlottie-player/dist/index.js"></script>
```

### In JavaScript or TypeScript

1. Install using npm or yarn:

```shell
npm install --save @johanaarstein/dotlottie-player
```

2. Import in your app:

```javascript
import '@johanaarstein/dotlottie-player'
```

## Usage

Add the element `dotlottie-player` to your code and point `src` to a Lottie animation of your choice.

```xml
<dotlottie-player
  autoplay
  controls
  loop
  mode="normal"
  src="https://storage.googleapis.com/aarsteinmedia/am.lottie"
  style="width: 320px; margin: auto;"
>
</dotlottie-player>
```

You may load animations programmatically:

```javascript
const player = document.querySelector('dotlottie-player')
player.load('https://storage.googleapis.com/aarsteinmedia/am.lottie')
```

### React.js / Next.js

Easy peasy lemon squeezy, right? Just import it and use it. If you've already imported the library in a parent component, you don't need to import it again in the child. The component is SSR compatible, so you won't have any issues there – however, you may want to set reflective booleans to an empty string to suppress hydration warnings.

```javascript
import '@johanaarstein/dotlottie-player'

function App() {
  return (
    <>
      <dotlottie-player
        src="https://storage.googleapis.com/aarsteinmedia/am.lottie"
        autoplay=""
        controls=""
        loop=""
        style={{
          width: '320px',
          margin: 'auto'
        }}
      />
    </>
  )
}

export default App
```

### Angular

1. Import the component in `app.component.ts`.

```typescript
import { Component } from '@angular/core'
import '@johanaarstein/dotlottie-player'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'your-app-name';
}
```

2. Add the player to your html template.

### Vue.js / Nuxt.js (using Vite.js)

Compared to React and Angular there's a couple of extra steps, but surely nothing too daunting.

1. Declare the dotlottie-player tag as a custom element, to prevent Vue from attempting to resolve it.

#### In Vue.js
`vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => ['dotlottie-player'].includes(tag),
        }
      }
    })
  ]
})
```

#### In Nuxt.js
`nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => ['dotlottie-player'].includes(tag),
    }
  }
})
```

2. Import/initiate the component.

#### In Vue.js
`main.ts`:

```typescript
import { createApp } from 'vue'
import { DotLottiePlayer } from '@johanaarstein/dotlottie-player'
import App from './App.vue'

const app = createApp(App)
app.component('DotLottiePlayer', DotLottiePlayer)
```

#### In Nuxt.js
Create a `plugins` folder in your root if it doesn't exist already, add a file named `dotlottie-player.js`:

```javascript
import { DotLottiePlayer } from '@johanaarstein/dotlottie-player'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.component('DotLottiePlayer', DotLottiePlayer)
})
```

3. The component can now be used in your pages or components template tags.

```vue
<template>
  <dotlottie-player
    src="https://storage.googleapis.com/aarsteinmedia/am.lottie"
    autoplay=""
    controls=""
    loop=""
    style="width: 320px; margin: auto;"
  />
</template>
```

## Properties

| Property / Attribute  | Description                        | Type                                     | Default           |
| --------------------- | ---------------------------------- | ---------------------------------------- | ----------------- |
| `autoplay`            | Play animation on load             | `boolean`                                | `false`           |
| `background`          | Background color                   | `string`                                 | `undefined`       |
| `controls`            | Show controls                      | `boolean`                                | `false`           |
| `count`               | Number of times to loop animation  | `number`                                 | `undefined`       |
| `direction`           | Direction of animation             | `1 \| -1`                                | `1`               |
| `hover`               | Whether to play on mouse hover     | `boolean`                                | `false`           |
| `loop`                | Whether to loop animation          | `boolean`                                | `false`           |
| `mode`                | Play mode                          | `normal` \| `bounce`                     | `normal`          |
| `objectfit`           | Resizing of animation in container | `contain` \| `cover` \| `fill` \| `none` | `contain`         |
| `renderer`            | Renderer to use                    | `svg` \| `canvas` \| `html`              | `'svg'`           |
| `speed`               | Animation speed                    | `number`                                 | `1`               |
| `src` _(required)_    | URL to LottieJSON or dotLottie     | `string`                                 | `undefined`       |

## Methods

| Function                                                                                                                                    | Method                                    |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Load                                                                                                      | `load(src: string) => void`               |
| Pause                                                                                                     | `pause() => void`                         |
| Play                                                                                                      | `play() => void`                          |
| Reload                                                                                                    | `reload() => void`                        |
| Go to frame. Can be a number or a percentage string (e.g. 50%).                                           | `seek(value: number \| string) => void`   |
| Set Direction                                                                                             | `setDirection(value: 1 \| -1) => void`    |
| Set Looping                                                                                               | `setLooping(value: boolean) => void`      |
| Set Speed                                                                                                 | `setSpeed(value?: number) => void`        |
| Snapshot the current frame as SVG. If 'download' is set to true, a download is triggered in the browser.  | `snapshot(download?: boolean) => string`  |
| Stop                                                                                                      | `stop() => void`                          |
| Toggle looping                                                                                            | `toggleLooping() => void`                 |
| Toggle play                                                                                               | `togglePlay() => void`                    |

## Events

The following events are exposed and can be listened to via `addEventListener` calls.

| Name       | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| `complete` | Animation is complete – including all loops                      |
| `destroyed`| Animation is destroyed                                           |
| `error`    | The source cannot be parsed, fails to load or has format errors  |
| `frame`    | A new frame is entered                                           |
| `freeze`   | Animation is paused due to player being out of view              |
| `load`     | Animation is loaded                                              |
| `loop`     | A loop is completed                                              |
| `play`     | Animation has started playing                                    |
| `pause`    | Animation has paused                                             |
| `ready`    | Animation is loaded and player is ready                          |
| `stop`     | Animation has stopped                                            |

## WordPress Plugin
<img align="left" width="110" height="110" src="/.github/wpIcon.svg" />

We've made a free WordPress plugin that works with Gutenberg Blocks, Elementor, Divi Builder and Flatsome UX Builder: [AM LottiePlayer](https://wordpress.org/plugins/am-lottieplayer/). It has all the functionality of this package, with a helpful user interface.

It's super lightweight – and only loads on pages where animations are used.

## License

GPL-2.0-or-later