// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json'),
  playerVerion = pkg.version,
  webVersion = pkg.dependencies['lottie-web']

export {
  playerVerion,
  webVersion
}