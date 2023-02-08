# dotLottie Player Web Component

![Awesome Vector Animations](/.github/readmeBanner.svg)

This started as a fork of [@dotlottie/player-component](https://github.com/dotlottie/player-component), mainly made to address issues with render settings and aspect ratio. Since then we've added some functionalies here and tweaked some configurations there, and now this is the most versatile and effective Lottie Web Component package out there – in our humble opinion! The component is SSR compatible, and weighs a fraction of what it did when we started out.

## Demo

Here is a [working demo](https://www.aarstein.media/en/dev/dotlottie-player)!

## Installation

### In HTML

There are two files in this package. The first, `index.js`, is an UMD where all the dependencies are bundled within, while `index.mjs` is an ESM where all the dependencies are external. If you don't use a package library or a tool like npm or yarn, go for the UMD. Otherwise we reccommend the ESM. 

- Import from CDN:

```xml
<script src="https://unpkg.com/@johanaarstein/dotlottie-player@latest/dist/index.js"></script>
```

- Import from local node_modules directory:

```xml
<script src="/node_modules/@johanaarstein/dotlottie-player/dist/index.mjs"></script>
```

### In Javascript or TypeScript

1. Install using npm or yarn:

```shell
npm install --save @johanaarstein/dotlottie-player
```

2. Import in your app:

```javascript
import '@johanaarstein/dotlottie-player'
```

## Usage

### The player component

Add the element `dotlottie-player` and set the `src` property to a URL pointing to a Lottie file – either LottieJSON or dotLottie.

```xml
<dotlottie-player
  autoplay
  controls
  loop
  mode="normal"
  src="https://storage.googleapis.com/aarsteinmedia/am.lottie"
  style="width: 320px"
>
</dotlottie-player>
```

You may load animations programmatically as well:

```xml
<dotlottie-player
  autoplay
  controls
  loop
  style="width: 320px"
>
</dotlottie-player>
```

```javascript
const player = document.querySelector('dotlottie-player')
player.load('https://storage.googleapis.com/aarsteinmedia/am.lottie')
```

### ReactJS

```javascript
import '@johanaarstein/dotlottie-player'

function App() {
  return (
    <div className="App">
      <dotlottie-player
        src="https://storage.googleapis.com/aarsteinmedia/am.lottie"
        autoplay
        loop
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  )
}

export default App
```

### ReactJS + Typescript

Same as above, but you also need to create a global.d.ts file in your src folder, to avoid a TypeScript error.

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    "dotlottie-player": any
  }
}
```

### NuxtJS / VueJS

1. Update the array of plugins in nuxt.config.js file in your root.

```javascript
plugins: [{ src: '~/plugins/lottie-player', mode: 'client' }]
```

2. Create a plugin folder in your root if it doesnt exist already, add a file named e. g. lottie-player.js.

```javascript
import * as LottiePlayer from '@johanaarstein/dotlottie-player'
```

3. The component can now be used in your pages or components template tags – without the need for any imports.

```xml
<template>
  <dotlottie-player
    src="https://storage.googleapis.com/aarsteinmedia/am.lottie"
    autoplay
    loop
  />
</template>
<script>
  export default {}
</script>
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
| `objectfit`           | Resizing of animation              | `contain` \| `cover` \| `fill` \| `none` | `contain`         |
| `renderer`            | Renderer to use                    | `svg` \| `canvas` \| `html`              | `'svg'`           |
| `speed`               | Animation speed                    | `number`                                 | `1`               |
| `src` _(required)_    | URL to LottieJSON or dotLottie     | `string`                                 | `undefined`       |

## Methods

| Name            | Method                                    | Description                                                                                               |
| --------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Load            | `load(src: string) => void`               |                                                                                                           |
| Pause           | `pause() => void`                         |                                                                                                           |
| Play            | `play() => void`                          |                                                                                                           |
| Reload          | `reload() => void`                        |                                                                                                           |
| Seek            | `seek(value: number \| string) => void`   | Go to frame. Can be a number or a percentage string (e.g. 50%).                                           |
| Set Direction   | `setDirection(value: 1 \| -1) => void`    |                                                                                                           |
| Set Looping     | `setLooping(value: boolean) => void`      |                                                                                                           |
| Set Speed       | `setSpeed(value?: number) => void`        |                                                                                                           |
| Snapshot        | `snapshot(download?: boolean) => string`  | Snapshot the current frame as SVG. If 'download' is set to true, a download is triggered in the browser.  |
| Stop            | `stop() => void`                          |                                                                                                           |
| Toggle looping  | `toggleLooping() => void`                 |                                                                                                           |
| Toggle play     | `togglePlay() => void`                    |                                                                                                           |

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

It's also super lightweight – and only loads on pages where it's in use.

## License

GPL-2.0-or-later