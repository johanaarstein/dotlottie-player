# dotLottie Player Web Component

![Awesome Vector Animations](/gitAssets/readmeBanner.svg)

This started as a fork of [@dotlottie/player-component](https://github.com/dotlottie/player-component), mainly made to address issues with canvas-rendering and aspect-ratio settings. We've since added some functionalies, and tweaked some configurations, and in our humble opinion this is now the most versatile and effective Lottie Web Component package out there.

## Demo

Here is a [working demo](https://www.aarstein.media/en/dev/dotlottie-player) of the package!

## Installation

### In HTML, import from CDN or from the local installation

- Import from CDN.

```xml
<script src="https://unpkg.com/@johanaarstein/dotlottie-player@latest/dist/dotlottie-player.js"></script>
```

- Import from local node_modules directory.

```xml
<script src="/node_modules/@johanaarstein/dotlottie-player/dist/dotlottie-player.js"></script>
```

### In Javascript or TypeScript

1. Install package using npm or yarn.

```shell
npm install --save @johanaarstein/dotlottie-player
```

2. Import package in your code.

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

You may set and load animations programmatically as well.

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

1. Import the player and use it like this:

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

1. Import like this:

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

2. Create a global.d.ts file in your src folder and add the code below:

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    "dotlottie-player": any
  }
}
```

### NextJS

1. To avoid "window is not defined" import the module inside a useEffect hook, like so:

```javascript
import { useEffect } from 'react'

function App() {

  useEffect(() => {
    import('@johanaarstein/dotlottie-player')
  }, [])

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

### NuxtJS / VueJS

1. Update the array of plugins in nuxt.config.js file in your root.

```javascript
plugins: [{ src: '~/plugins/lottie-player', mode: 'client' }]
```

2. Create a plugin folder in your root if it doesnt exist already, add a file named e. g. lottie-player.js with the following content.

```javascript
import * as LottiePlayer from '@johanaarstein/dotlottie-player'
```

3. The component can now be used in your pages or components template tag like below – without any imports necessary.

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

In VueJS the library/player must be declared as a client side plugin module.

## Properties

| Property              | Attribute             | Description                        | Type                                 | Default           |
| --------------------- | --------------------- | ---------------------------------- | ------------------------------------ | ----------------- |
| `autoplay`            | `autoplay`            | Autoplay animation on load         | `boolean`                            | `false`           |
| `background`          | `background`          | Background color                   | `string`                             | `undefined`       |
| `controls`            | `controls`            | Show controls                      | `boolean`                            | `false`           |
| `count`               | `count`               | Number of times to loop animation  | `number`                             | `undefined`       |
| `direction`           | `direction`           | Direction of animation             | `number`                             | `1`               |
| `hover`               | `hover`               | Whether to play on mouse hover     | `boolean`                            | `false`           |
| `loop`                | `loop`                | Whether to loop animation          | `boolean`                            | `false`           |
| `mode`                | `mode`                | Play mode                          | `PlayMode.Bounce \| PlayMode.Normal` | `PlayMode.Normal` |
| `preserveAspectRatio` | `preserveAspectRatio` | Aspect ratio                       | `string`                             | `'xMidYMid meet'` |
| `renderer`            | `renderer`            | Renderer to use                    | `"svg"`                              | `'svg'`           |
| `speed`               | `speed`               | Animation speed                    | `number`                             | `1`               |
| `src` _(required)_    | `src`                 | URL to JSON or .lottie file        | `string`                             | `undefined`       |

## Methods

### Load

**`load(src: string) => void`**

Load (and play) a given Lottie animation.

#### Parameters

| Name  | Type     | Description            |
| ----- | -------- | ---------------------- |
| `src` | `string` | URL to a .lottie file. |

#### Returns

Type: `void`

### Pause

**`pause() => void`**

Pause animation.

#### Returns

Type: `void`

### Play

**`play() => void`**

Play animation.

#### Returns

Type: `void`

### Set Direction

**`setDirection(value: number) => void`**

Set animation direction.

#### Parameters

| Name    | Type     | Description       |
| ------- | -------- | ----------------- |
| `value` | `number` | Direction values  |

#### Returns

Type: `void`

### Set Looping

**`setLooping(value: boolean) => void`**

Set looping of animation.

#### Parameters

| Name    | Type      | Description               |
| ------- | --------- | --------------------------|
| `value` | `boolean` | Whether to enable looping |

#### Returns

Type: `void`

### Set speed

**`setSpeed(value?: number) => void`**

Set animation speed.

#### Parameters

| Name    | Type     | Description     |
| ------- | -------- | --------------- |
| `value` | `number` | Playback speed  |

#### Returns

Type: `void`

### Stop

**`stop() => void`**

Stop animation.

#### Returns

Type: `void`

### Seek

**`seek(value: number | string) => void`**

Go to frame. Can be a number or a percentage string (e.g. 50%).

#### Returns

Type: `void`

### Snapshot

**`snapshot(download?: boolean) => string`**

Snapshot the current frame as SVG. If 'download' is set to true, a download is triggered in the browser.

#### Returns

Type: `string`

### Toggle looping

**`toggleLooping() => void`**

Toggle looping.

#### Returns

Type: `void`

### Toggle play

**`togglePlay() => void`**

Toggle playing.

#### Returns

Type: `void`

### Reload

**`reload() => void`**

Reload Lottie.

#### Returns

Type: `void`

## Events

The following events are exposed and can be listened to via `addEventListener` calls.

| Name       | Description                                                               |
| ---------- | ------------------------------------------------------------------------- |
| `complete` | Animation is complete – including all loops                               |
| `destroyed`| Animation is destroyed                                                    |
| `error`    | An animation source cannot be parsed, fails to load or has format errors  |
| `frame`    | A new frame is entered                                                    |
| `freeze`   | Animation is paused due to player being out of view                       |
| `load`     | Animation is loaded                                                       |
| `loop`     | A loop is completed                                                       |
| `play`     | Animation has started plahing                                             |
| `pause`    | Animation has paused                                                      |
| `ready`    | Animation is loaded and player is ready                                   |
| `stop`     | Animation has stopped                                                     |

## WordPress Plugin
<img align="left" width="110" height="110" src="/gitAssets/wpIcon.svg" style="padding-right: 20px" />

We've made a free WordPress plugin that works with Gutenberg Blocks, Elementor and Divi Builder: [AM LottiePlayer](https://wordpress.org/plugins/am-lottieplayer/). It has all the functionality of this package, with a helpful user interface.

It's also super lightweight – and only loads on pages where it's in use.

## License

GPL-2.0-or-later